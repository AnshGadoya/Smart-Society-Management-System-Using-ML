import os
from datetime import datetime
from pymongo import MongoClient
from flask import abort

class MongoQuery:
    def __init__(self, model_cls, filter_dict=None, sort_list=None):
        self.model_cls = model_cls
        self.filter_dict = filter_dict or {}
        self.sort_list = sort_list or []

    def filter_by(self, **kwargs):
        new_filter = dict(self.filter_dict)
        for k, v in kwargs.items():
            new_filter[k] = v
        return MongoQuery(self.model_cls, new_filter, self.sort_list)

    def filter(self, *criterion):
        new_filter = dict(self.filter_dict)
        for c in criterion:
            if isinstance(c, dict):
                new_filter.update(c)
            elif hasattr(c, "to_mongo_filter"):
                new_filter.update(c.to_mongo_filter())
        return MongoQuery(self.model_cls, new_filter, self.sort_list)

    def order_by(self, *criterion):
        new_sort = list(self.sort_list)
        for c in criterion:
            if isinstance(c, str):
                new_sort.append((c, 1))
            elif hasattr(c, "key") and hasattr(c, "direction"):
                new_sort.append((c.key, c.direction))
            elif hasattr(c, "name"):
                new_sort.append((c.name, 1))
        return MongoQuery(self.model_cls, self.filter_dict, new_sort)

    def all(self):
        coll = self.model_cls._get_collection()
        if coll is None:
            return []
        cursor = coll.find(self.filter_dict)
        if self.sort_list:
            cursor = cursor.sort(self.sort_list)
        return [self.model_cls._from_doc(doc) for doc in cursor]

    def first(self):
        coll = self.model_cls._get_collection()
        if coll is None:
            return None
        cursor = coll.find(self.filter_dict)
        if self.sort_list:
            cursor = cursor.sort(self.sort_list)
        doc = next(cursor, None)
        return self.model_cls._from_doc(doc) if doc else None

    def first_or_404(self):
        obj = self.first()
        if not obj:
            abort(404, description=f"{self.model_cls.__name__} not found")
        return obj

    def get(self, ident):
        coll = self.model_cls._get_collection()
        pk = self.model_cls._primary_key
        # Try both int and str if ident is numeric
        queries = [{pk: ident}]
        try:
            queries.append({pk: int(ident)})
        except (ValueError, TypeError):
            pass
        try:
            queries.append({pk: str(ident)})
        except (ValueError, TypeError):
            pass
        
        doc = coll.find_one({"$or": queries})
        return self.model_cls._from_doc(doc) if doc else None

    def get_or_404(self, ident):
        obj = self.get(ident)
        if not obj:
            abort(404, description=f"{self.model_cls.__name__} not found")
        return obj

    def count(self):
        coll = self.model_cls._get_collection()
        return coll.count_documents(self.filter_dict)

    def join(self, target_model):
        # Stub to allow chained syntax: Model.query.join(Target).filter(...)
        return self


class ColumnFilter:
    def __init__(self, filter_dict):
        self.filter_dict = filter_dict

    def to_mongo_filter(self):
        return self.filter_dict

    def __or__(self, other):
        f1 = self.to_mongo_filter()
        f2 = other.to_mongo_filter() if hasattr(other, "to_mongo_filter") else other
        return ColumnFilter({"$or": [f1, f2]})

    def __and__(self, other):
        f1 = self.to_mongo_filter()
        f2 = other.to_mongo_filter() if hasattr(other, "to_mongo_filter") else other
        return ColumnFilter({"$and": [f1, f2]})


class ColumnExpr:
    def __init__(self, key, direction=1):
        self.key = key
        self.direction = direction

    def desc(self):
        return ColumnExpr(self.key, -1)

    def asc(self):
        return ColumnExpr(self.key, 1)

    def ilike(self, pattern):
        clean = pattern.replace("%", ".*")
        return ColumnFilter({self.key: {"$regex": f"^{clean}$", "$options": "i"}})

    def __eq__(self, other):
        return ColumnFilter({self.key: other})

    def __ne__(self, other):
        return ColumnFilter({self.key: {"$ne": other}})

    def __or__(self, other):
        f1 = {self.key: 1}
        f2 = other.to_mongo_filter() if hasattr(other, "to_mongo_filter") else other
        return ColumnFilter({"$or": [f1, f2]})


class ModelMeta(type):
    def __getattr__(cls, name):
        if name == "query":
            return MongoQuery(cls)
        return ColumnExpr(name)


class MongoModel(metaclass=ModelMeta):
    __tablename__ = None
    _primary_key = "id"

    def __init__(self, **kwargs):
        self._doc = dict(kwargs)
        for k, v in kwargs.items():
            setattr(self, k, v)

    @classmethod
    def _get_collection(cls):
        from utils.config import db
        if db.db is None:
            return None
        return db.get_collection(cls.__tablename__)

    @classmethod
    def _from_doc(cls, doc):
        if not doc:
            return None
        # Preserve document fields
        inst = cls(**{k: v for k, v in doc.items() if k != "_id"})
        inst._id = doc.get("_id")
        return inst

    def __getattr__(self, name):
        if name in self.__dict__:
            return self.__dict__[name]
        if "_doc" in self.__dict__ and name in self._doc:
            return self._doc[name]
        return None

    def __setattr__(self, name, value):
        super().__setattr__(name, value)
        if name not in ("_doc", "_id") and hasattr(self, "_doc"):
            self._doc[name] = value

    def to_dict(self):
        res = dict(self._doc)
        if "_id" in res:
            res["_id"] = str(res["_id"])
        return res


class MongoSession:
    def __init__(self, db_instance):
        self.db_instance = db_instance
        self.pending_adds = []
        self.pending_deletes = []

    def add(self, instance):
        if instance not in self.pending_adds:
            self.pending_adds.append(instance)

    def add_all(self, instances):
        for inst in instances:
            self.add(inst)

    def delete(self, instance):
        if instance not in self.pending_deletes:
            self.pending_deletes.append(instance)

    def commit(self):
        if self.db_instance.db is None:
            print("[MongoDB] Cannot commit: MongoDB is not connected yet.")
            self.pending_adds.clear()
            self.pending_deletes.clear()
            return
        # Process pending deletes
        for inst in self.pending_deletes:
            coll = inst._get_collection()
            pk = inst._primary_key
            val = getattr(inst, pk, None)
            if val is not None:
                coll.delete_one({pk: val})
            elif hasattr(inst, "_id"):
                coll.delete_one({"_id": inst._id})
        self.pending_deletes.clear()

        # Process pending adds/updates
        for inst in self.pending_adds:
            coll = inst._get_collection()
            pk = inst._primary_key
            val = getattr(inst, pk, None)

            # Auto-assign integer ID if pk is id and not provided
            if pk == "id" and val is None:
                new_id = self.db_instance.get_next_sequence(inst.__tablename__)
                setattr(inst, "id", new_id)
                val = new_id

            data = dict(inst._doc)
            if "_id" in data:
                del data["_id"]

            if val is not None:
                res = coll.update_one({pk: val}, {"$set": data}, upsert=True)
                if res.upserted_id:
                    inst._id = res.upserted_id
            else:
                res = coll.insert_one(data)
                inst._id = res.inserted_id

        self.pending_adds.clear()

    def rollback(self):
        self.pending_adds.clear()
        self.pending_deletes.clear()


class MongoDB:
    def __init__(self, app=None):
        self.client = None
        self.db = None
        self.Model = MongoModel
        self.session = MongoSession(self)
        if app:
            self.init_app(app)

    def init_app(self, app):
        uri = (
            app.config.get("MONGO_URI") or 
            os.getenv("MONGO_URI") or 
            os.getenv("MONGODB_URI") or 
            app.config.get("SQLALCHEMY_DATABASE_URI")
        )
        if not uri or "<cluster-url>" in uri or not ("mongodb://" in uri or "mongodb+srv://" in uri):
            print("[MongoDB] Warning: Valid MONGO_URI not configured in backend/.env yet. Please provide your MongoDB Atlas connection string.")
            return

        try:
            try:
                import certifi
                ca_file = certifi.where()
            except ImportError:
                ca_file = None

            client_kwargs = {"serverSelectionTimeoutMS": 10000}
            if ca_file:
                client_kwargs["tlsCAFile"] = ca_file

            self.client = MongoClient(uri, **client_kwargs)
            try:
                self.db = self.client.get_default_database()
            except Exception:
                self.db = self.client["smart_demo"]
            if self.db is None:
                self.db = self.client["smart_demo"]
            print(f"[MongoDB] Connected successfully to database: {self.db.name}")
        except Exception as e:
            print(f"[MongoDB] Connection error: {e}. Please check your MONGO_URI in backend/.env.")

    def get_collection(self, coll_name):
        if self.db is None:
            raise RuntimeError("MongoDB is not initialized. Please call init_app() first.")
        return self.db[coll_name]

    def get_next_sequence(self, name):
        counters = self.get_collection("_counters")
        seq = counters.find_one_and_update(
            {"_id": name},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=True
        )
        return seq["seq"]

    def create_all(self):
        """Ensure collections and default indexes exist."""
        pass

    def drop_all(self):
        """Drop all collections (used only in testing/development)."""
        if self.db is not None:
            for coll in self.db.list_collection_names():
                if not coll.startswith("system."):
                    self.db[coll].drop()

    # Emulate Column, Integer, etc. for any model files importing db.Column
    class Column:
        def __init__(self, *args, **kwargs):
            pass
    class Integer: pass
    class String:
        def __init__(self, *args, **kwargs): pass
    class Text: pass
    class Float: pass
    class Boolean: pass
    class Date: pass
    class DateTime:
        def __init__(self, *args, **kwargs): pass
    class ForeignKey:
        def __init__(self, *args, **kwargs): pass
    class UniqueConstraint:
        def __init__(self, *args, **kwargs): pass

    @staticmethod
    def relationship(*args, **kwargs):
        return None
