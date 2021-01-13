import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() pageSize: number = 0;
  @Input() totalEntries: number = 0;
  @Input() activePage: number = 0;
  @Output('activePageChange') pageChangedEmitter = new EventEmitter<number>();

  totalPages = 0;
  pageDisplays: string[] = [];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if ('pageSize' in changes || 'totalEntries' in changes) {
      this.totalPages = Math.ceil(this.totalEntries / this.pageSize);
      if (this.totalPages > 0) {
        this.pageDisplays = [];
        for (let i = 1; i <= this.totalPages; i++) {
          this.pageDisplays.push((this.pageSize * (i - 1) + 1) + '-' + ((this.pageSize * i > this.totalEntries) ? this.totalEntries : this.pageSize * i));
        }
        if (this.activePage < 1) {
          this.activePage = 1;
          this.pageChangedEmitter.emit(this.activePage);
        } else if (this.activePage > this.totalPages) {
          this.activePage = this.totalPages;
          this.pageChangedEmitter.emit(this.activePage);
        }
      } else {
        this.activePage = 0;
      }
    }
  }

  onPageChange(newPage: number) {
    if (this.activePage != newPage) {
      this.activePage = newPage;
      this.pageChangedEmitter.emit(this.activePage);
    }
  }
  onPrevPage() {
    this.onPageChange(this.activePage - 1 > 0 ? this.activePage - 1 : this.activePage);
  }

  onNextPage() {
    this.onPageChange(this.activePage + 1 < this.totalPages ? this.activePage + 1 : this.totalPages);
  }
}
