import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';

@Component({
  selector: 'app-responses-table',
  templateUrl: './responses-table.component.html',
  styleUrls: ['./responses-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsesTableComponent {
  public _quizResponses: QuizResponse[] = [];
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'createdOn',
    'maven',
    'challenger',
    'commander',
    'motivator',
    'seer',
    'professor',
    'healer',
  ];
  public dataSource: MatTableDataSource<QuizResponse>;
  public searchForm: FormGroup;
  public dateSearch: string;
  public stringSearch: string;

  @Input() public quizResponses: QuizResponse[] = [];

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  public constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.searchFormInit();
    this._quizResponses = [...this.quizResponses];
    this.dataSource = new MatTableDataSource(this.quizResponses);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({
      id: 'createdOn',
      start: 'desc',
      disableClear: false,
    });
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      stringSearch: new FormControl('', Validators.pattern('^[a-zA-Z @]+$')),
      dateSearch: new FormControl(''),
    });
  }

  public applyFilter() {
    const stringSearchValue = this.searchForm.get('stringSearch').value;
    console.log('stringSearchValue', stringSearchValue);
    
    const dateSearchValue = this.retrieveDateFilterString(
      this.searchForm.get('dateSearch').value
    );

    this.dateSearch =
      dateSearchValue === null || dateSearchValue === '' ? '' : dateSearchValue;
    this.stringSearch = stringSearchValue === null ? '' : stringSearchValue;

    // create string of our searching values and split if by '$'
    const filterValue = this.stringSearch + '$' + this.dateSearch + '$';
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public retrieveDateFilterString(date: Date): string {
    if (date) {
      const localDate = new Date(date.toLocaleDateString());
      const day = localDate.getDate();
      const month = localDate.getMonth();
      const year = localDate.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return '';
  }

  public getFilterPredicate() {
    return (row: QuizResponse, filters: string) => {
      // split string per '$' to array
      const filterArray = filters.split('$');
      const stringFilterValue = filterArray[0];
      const dateFilterValue = filterArray[1];

      const matchFilter = [];

      // Fetch data from row
      const columnFirstName = row.firstName;
      const columnLastName = row.lastName;
      const columnEmail = row.email;
      const columncreatedAt = this.retrieveDateFilterString(
        new Date(row.createdOn)
      );

      // verify fetching data by our searching values
      const customFilterFN = columnFirstName
        .toLowerCase()
        .includes(stringFilterValue);
      const customFilterLN = columnLastName
        .toLowerCase()
        .includes(stringFilterValue);
      const customFilterEM = columnEmail
        .toLowerCase()
        .includes(stringFilterValue);
      const customFilterCO =
        !dateFilterValue || columncreatedAt.toLowerCase() === dateFilterValue;

      // push boolean values into array
      matchFilter.push(customFilterFN);
      matchFilter.push(customFilterLN);
      matchFilter.push(customFilterEM);

      return (
        (matchFilter.some(Boolean) && customFilterCO) ||
        (!dateFilterValue && !stringFilterValue)
      );
    };
  }

  public onRowClick(row: any): void {
    this.router.navigate(['response'], {
      queryParams: { id: row.id },
    });
  }

  public onResetDate(): void {
    this.searchForm.reset();
    this.applyFilter();
  }
}
