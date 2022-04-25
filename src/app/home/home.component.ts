import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface employeeDetail {
  id: number,
  dob: string,
  email: string,
  phone: string,
  gender: boolean,
  company: string,
  fullName: string,
  position: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pageNumber = null;
  pageLimit = null;
  employeeDetailList: employeeDetail[] = [];
  isLoading = false;
  searchText = "";
  searchCategory = "email";
  pageLimitForm = new FormGroup({
    pageLimit: new FormControl(this.pageLimit)
  });
  pageLimitControl: FormControl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageLimitControl = this.pageLimitForm.controls.pageLimit as FormControl;
    this.route.queryParams.subscribe( params => {
      this.pageNumber = +params._page;
      this.pageLimit = +params._limit;
      this.pageLimitControl.patchValue(this.pageLimit);
      this.getEmployeeDetailList();
    })
  }

  /**
   * @description To get employee detail list
   */
  getEmployeeDetailList(): void {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("_page", this.pageNumber.toString());
    queryParams = queryParams.append("_limit", this.pageLimitControl.value);
    this.isLoading = true;
    this.http.get<employeeDetail[]>('https://retoolapi.dev/ri70xr/employees?', { params: queryParams }).subscribe( employeeData => {
      this.isLoading = false;
      this.employeeDetailList = employeeData;
    });
  }

  /**
   * @description To navigate to add employee form page
   */
  addNewEmployeeDetail(): void {
    this.router.navigate(['/add-employee']);
  }

  /**
   * @description To navigate to edit employee form page
   */
  editEmployeeDetail(id: number): void {
    this.router.navigate([`/edit-employee/${id}`]);
  }

  /**
   * @description Delete employee detail
   */
  deleteEmployeeDetail(id: number, index: number): void {
    if (confirm('Do you want to delete the employee details?')) {
      this.http.delete(`https://retoolapi.dev/ri70xr/employees/${id}`).subscribe( res => {
        this.employeeDetailList.splice(index, 1);
        alert('Employee Detail removed successfully');
      });
    }
  }

  /**
   * @description To prevent key stroke
   */
  preventKey(): boolean {
    return false;
  }

  /**
   * @description To prevent right click
   */
  preventRightClick(): boolean {
    return false;
  }

  /**
   * @description Update the page with queryParams and data
   */
  updatePage(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        _limit: this.pageLimitControl.value
      }, 
      queryParamsHandling: 'merge',
    });
  }

  /**
   * @description To move page in pagination
   */
  onMovePage(number: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        _page: this.pageNumber + number
      }, 
      queryParamsHandling: 'merge'
    });
  }

  /**
   * @description To Search an employee detail
   * @param form ngForm
   */
  searchEmployee(form: any) {
    if (form.valid) {
      this.searchText = form.value.searchText;
      this.searchCategory = form.value.searchCategory;
    }
  }
}
