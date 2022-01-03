/**
 * Pagenation<T>
 */
export class Pagenation{
  current = 1;
  pageSize = 5;
  totalPage = 1;
  totalItems = 0;
  /**
   * @type {T[]}
   */
  records = [];

  constructor(records = [], totalPage = 1, totalItems = 0) {
    this.records = records;
    this.totalPage = totalPage;
    this.totalItems = totalItems;
  }

}
