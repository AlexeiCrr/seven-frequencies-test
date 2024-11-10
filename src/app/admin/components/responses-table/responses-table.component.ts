import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
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
		'licenseCode',
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
	public licenseSearch: string;

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
			licenseSearch: new FormControl(''),
		});
	}

	public applyFilter() {
		const stringSearchValue = this.searchForm.get('stringSearch').value;
		const dateSearchValue = this.retrieveDateFilterString(this.searchForm.get('dateSearch').value);
		const licenseSearchValue = this.searchForm.get('licenseSearch').value;

		this.dateSearch = dateSearchValue === null || dateSearchValue === '' ? '' : dateSearchValue;
		this.stringSearch = stringSearchValue === null ? '' : stringSearchValue;
		this.licenseSearch = licenseSearchValue === null ? '' : licenseSearchValue.trim();

		// create string of our searching values and split if by '$'
		const filterValue = this.stringSearch + '$' + this.dateSearch + '$' + this.licenseSearch + '$';

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
			const stringFilterValue = filterArray[0].toLowerCase();
			const dateFilterValue = filterArray[1];
			const licenseFilterValue = filterArray[2].toLowerCase();

			// Check if all filters are empty
			if (!stringFilterValue && !dateFilterValue && !licenseFilterValue) {
				return true;
			}

			// License code filter (optimized)
			if (licenseFilterValue) {
				const columnLicenseCode = (row.licenseCode || '').toLowerCase();
				if (!columnLicenseCode.includes(licenseFilterValue)) {
					return false;
				}
			}

			// Date filter
			if (dateFilterValue) {
				const columncreatedAt = this.retrieveDateFilterString(
					new Date(row.createdOn)
				).toLowerCase();
				if (columncreatedAt !== dateFilterValue) {
					return false;
				}
			}

			// String filter (name/email)
			if (stringFilterValue) {
				const columnFirstName = (row.firstName || '').toLowerCase();
				const columnLastName = (row.lastName || '').toLowerCase();
				const columnEmail = (row.email || '').toLowerCase();

				return (
					columnFirstName.includes(stringFilterValue) ||
					columnLastName.includes(stringFilterValue) ||
					columnEmail.includes(stringFilterValue)
				);
			}

			return true;
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

	public handleDownloadResults() {
		const headers = [
			'ID',
			'First Name',
			'Last Name',
			'Email',
			'License Code',
			'Created On',
			...Object.keys(this.quizResponses[0]?.frequencies || {}),
		];
		const csvContent = [
			headers.join(','),
			...this.quizResponses.map((response) =>
				[
					response.id,
					response.firstName,
					response.lastName,
					response.email,
					response.licenseCode,
					response.createdOn,
					...Object.values(response.frequencies),
				].join(',')
			),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', 'quiz_responses.csv');
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}
