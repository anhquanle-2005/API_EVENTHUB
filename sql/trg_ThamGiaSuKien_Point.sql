CREATE OR ALTER TRIGGER trg_ThamGiaSuKien_Point
ON ThamGiaSuKien
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH Changes AS (
        SELECT
            i.MaTK,
            i.MaSK,
            CAST(ISNULL(i.DaCongDiem, 0) AS int) AS NewDaCong,
            CAST(ISNULL(d.DaCongDiem, 0) AS int) AS OldDaCong
        FROM inserted i
        LEFT JOIN deleted d
            ON d.MaTK = i.MaTK AND d.MaSK = i.MaSK
    ),
    DeltaPoints AS (
        SELECT
            c.MaTK,
            SUM(CASE
                WHEN c.OldDaCong = 0 AND c.NewDaCong = 1 THEN ISNULL(sk.DiemCong, 0)
                WHEN c.OldDaCong = 1 AND c.NewDaCong = 0 THEN -ISNULL(sk.DiemCong, 0)
                ELSE 0
            END) AS Delta
        FROM Changes c
        JOIN SuKien sk ON sk.MaSK = c.MaSK
        GROUP BY c.MaTK
    )
    UPDATE tk
    SET tk.DiemTichLuy = CASE
        WHEN ISNULL(tk.DiemTichLuy, 0) + d.Delta < 0 THEN 0
        ELSE ISNULL(tk.DiemTichLuy, 0) + d.Delta
    END
    FROM TaiKhoan tk
    JOIN DeltaPoints d ON d.MaTK = tk.MaTK
    WHERE d.Delta <> 0;
END;
