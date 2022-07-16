export default class Utility {
  static createCellsArray = (rows, columns) => (Array.from({length: rows * columns}).map(
    (e, i) => ({
        x: i % columns,
        y: (i - (i % columns)) / columns,
        selected: false,
        isPartOfNewTable: false
      })
    )
  );

  static minutesToHours = (minutes) => +(minutes / 60).toFixed(2);
};