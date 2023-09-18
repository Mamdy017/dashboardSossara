
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/NgbdSortableHeader';
import { blog } from '../data/tables/product-list';

// Définissez l'interface Product ici


interface SearchResult {
  tableItem: blog[];
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
export class BlogService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new BehaviorSubject<void>(null);
  private _tableItem$ = new BehaviorSubject<blog[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  productsData: blog[] = [];

  private _state: State = {
    page: 1,
    pageSize: 6,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor() {
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

  get tableItem$(): Observable<blog[]> { return this._tableItem$.asObservable(); }
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

  setProductsData(data: blog[]) {
    this.productsData = data;
    this._search$.next();
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. Sort
    let tableItem = [...this.productsData];
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

  private _sort(data: blog[], column: SortColumn, direction: SortDirection): blog[] {
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

  private _matches(data: blog, term: string): boolean {
    return data.titre.toLowerCase().includes(term.toLowerCase())
      || data.description.toLowerCase().includes(term.toLowerCase());
  }
}

