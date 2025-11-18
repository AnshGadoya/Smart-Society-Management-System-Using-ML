export const getLast7DaysSpark = (records, dateKey) => {
    const today = new Date();
    const map = {};

    // Pre-build frequency map in ONE loop
    for (let r of records) {
        if (!r[dateKey]) continue;

        const d = r[dateKey].split(" ")[0]; // "2025-11-14"
        map[d] = (map[d] || 0) + 1;
    }

    const spark = [];

    // Generate last 7 days using the prebuilt map
    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);

        const formatted = day.toISOString().split("T")[0];
        spark.push(map[formatted] || 0);
    }

    return spark;
};

export const calculatePercentage = (spark) => {
  const yesterday = spark[spark.length - 2];
  const today = spark[spark.length - 1];

  if (yesterday === 0 && today > 0) return { value: "NEW", color: "success" };
  if (yesterday === 0 && today === 0) return { value: 0, color: "secondary" };

  const diff = ((today - yesterday) / yesterday) * 100;
  return {
    value: diff.toFixed(1),
    color: diff >= 0 ? "success" : "danger"
  };
};
