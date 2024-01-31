import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Answer } from 'src/app/quiz/interfaces/answer';

@Component({
  selector: 'app-answers-table',
  templateUrl: './answers-table.component.html',
  styleUrls: ['./answers-table.component.scss'],
})
export class AnswersTableComponent implements OnChanges {
  @Input() public answers: Answer[] = [];

  @ViewChild(MatSort) public sort: MatSort;

  public displayedColumns: string[] = ['description', 'value', 'frequencyName'];

  public ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public dataSource: MatTableDataSource<Answer> = new MatTableDataSource(
    this.answers
  );

  public ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.answers);
  }
}
