import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { CompanyDB } from '../data/tables/company';
import { SortColumn, SortDirection } from '../directives/NgbdSortableHeader';

interface SearchResult {
  tableItem: CompanyDB[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Injectable({ providedIn: 'root' })
export class TableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new BehaviorSubject<void>(null);
  private _tableItem$ = new BehaviorSubject<CompanyDB[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  userData: CompanyDB[] = [];

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._tableItem$.next(result.tableItem);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get tableItem$(): Observable<CompanyDB[]> { return this._tableItem$.asObservable(); }
  get total$(): Observable<number> { return this._total$.asObservable(); }
  get loading$(): Observable<boolean> { return this._loading$.asObservable(); }
  get page(): number { return this._state.page; }
  get pageSize(): number { return this._state.pageSize; }
  get searchTerm(): string { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  setUserData(data: CompanyDB[]) {
    this.userData = data;
    this._search$.next();
  }

  deleteSingleData(name: string) {
    const tableItem = this.userData.slice();
    const total = tableItem.length;

    tableItem.forEach((item, index) => {
      if (name === item.username) {
        tableItem.splice(index, 1);
      }
    });

    this._tableItem$.next(tableItem);
    this._total$.next(total);
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. Sort
    let tableItem = [...this.userData];
    if (sortColumn && sortDirection) {
      tableItem = this._sort(tableItem, sortColumn, sortDirection);
    }

    // 2. Filter
    const total = tableItem.length;
    tableItem = tableItem.filter(item => this._matches(item, searchTerm));

    tableItem = tableItem
      .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ tableItem, total });
  }

  private _sort(data: CompanyDB[], column: SortColumn, direction: SortDirection): CompanyDB[] {
    return [...data].sort((a, b) => {
      const res = this._compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  private _compare(v1: string | number, v2: string | number) {
    if (v1 < v2) {
      return -1;
    } else if (v1 > v2) {
      return 1;
    } else {
      return 0;
    }
  }

  private _matches(data: CompanyDB, term: string): boolean {
    return data.username.toLowerCase().includes(term.toLowerCase())
      || data.description.toLowerCase().includes(term.toLowerCase());
  }

  
}
