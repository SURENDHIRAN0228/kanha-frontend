import { Component, AfterViewInit, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { SidebarService } from '../sidebar.service';
declare const $:any;
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MainService } from '../services/main.service';



@Component({
  selector: 'app-asset-manage',
  templateUrl: './asset-manage.component.html',
  styleUrls: ['./asset-manage.component.css']
})
export class AssetManageComponent implements OnInit, AfterViewInit{

  //Dropdown lists
  assetClassifications: string[] = ['Furniture', 'Machinery', 'Kitchen Essentials', 'Fitting Tools', 'Plant Equipments', 'Electronic Items', 'Electric Items & Fittings'];

  departments: string[] = ['Admin Block Co-ordinators', 'Agri', 'Agriculture/Horticulture', 'Ashram Manager', 'Ashram Office', 'Chemistry', 'Chief Architect', 'Cyber Security', 'Human Resources', 'Orthology', 'Physics', 'Plumbing', 'Survey', 'Work Admin'];

  assetCategories: string[] = ['Movable' , 'Fixed'];

  locations: string[] = ['N30', 'N32', 'N33', 'N56', 'N57', 'N58', 'N61', 'N62', 'N63'];

  assetForm!: FormGroup;

  editAsset!: FormGroup;

  isSidebarOpen: boolean = false;

  assets : any[] = [];

  assetImage: File | null = null;
  storeInwardCopy: File | null = null;
  departmentGatepassCopy: File | null = null;
  warrantyCopy: File | null = null;
  insuranceCopy: File | null = null;
  purchaseAndDisposalApprovalCopy: File | null = null;
  purchaseOrderCopy: File | null = null;
  invoiceCopy: File | null = null;
  file: File | null = null;
  someObject: HTMLInputElement | null = null;

  constructor(private sidebarService: SidebarService, private fb: FormBuilder, private toastr:ToastrService, private mainService: MainService, private router: Router){}
  

  ngAfterViewInit(): void {
    
  }


  //Enabling delete all button
  headerCheckboxChecked = false;
  bodyCheckboxesChecked = false;
  selectedCheckboxesCount: number = 0; // Track the number of selected checkboxes


  headerCheckboxChanged(event: any) {
    const isChecked = event.target.checked;
    this.headerCheckboxChecked = isChecked;
    const checkboxes = document.querySelectorAll('.bodyCheckbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });

    if (isChecked) {
      this.selectedCheckboxesCount = this.assets.length;
      this.checkedAssetIds = this.assets.map(asset => asset.id);
  } else {
      this.selectedCheckboxesCount = 0;
      this.checkedAssetIds = [];
  }

    this.updateDeleteAllButtonVisibility();
  }


  checkedAssetIds: number[] = [];

  // bodyCheckboxChanged(event: any,assetId: number) {
  //   // Check the number of checked checkboxes
  //   const checkboxes = document.querySelectorAll('.bodyCheckbox') as NodeListOf<HTMLInputElement>;
  //   let checkedCount = 0;
  //   checkboxes.forEach(checkbox => {
  //       if (checkbox.checked) {
  //           checkedCount++;
  //       }
  //   });
  //   // Show the delete all button only if more than one checkbox is checked
  //   this.bodyCheckboxesChecked = checkedCount > 1;


  //   const isChecked = event.target.checked;

  //   if (isChecked) {
  //       // If checked, add the asset ID to the checkedAssetIds array
  //       this.checkedAssetIds.push(assetId);
  //   } else {
  //       // If unchecked, remove the asset ID from the checkedAssetIds array
  //       this.checkedAssetIds = this.checkedAssetIds.filter(id => id !== assetId);
  //   }

  // }

  

//   bodyCheckboxChanged(event: any) {
//     // Check if the event target and checked property are valid
//     if (event && event.target && typeof event.target.checked !== 'undefined') {
//         // Access the checked property safely
//         const isChecked = event.target.checked;
//         // Further processing based on the checkbox state
//         const rowId = $(event.target).data('row-id');
//         console.log('Checkbox rowId:', rowId);
//         // Proceed with handling checkbox change
//     } else {
//         console.error('Event target is undefined or does not have a checked property.');
//     }
// }

// bodyCheckboxChanged(event:any) {
//   alert('hai');
//   const checkboxes = document.querySelectorAll('.bodyCheckbox') as NodeListOf<HTMLInputElement>;
//   let checkedCount = 0;
  
//   checkboxes.forEach((checkbox: any) => {
//     if (checkbox.checked) {
//       checkedCount++;
//     }
//   });

//   // Update the count of selected checkboxes
//   this.selectedCheckboxesCount = checkedCount;
//   console.log(checkedCount)
//   this.updateDeleteAllButtonVisibility();
// }

bodyCheckboxChanged(checkbox: any, rowId: number) {
  // Handle checkbox change here
  const isChecked = checkbox.checked;
  
  // Do whatever you need with the checkbox state and row ID
  // For example, update selectedCheckboxesCount and updateDeleteAllButtonVisibility
  const checkboxes = document.querySelectorAll('.bodyCheckbox') as NodeListOf<HTMLInputElement>;
  let checkedCount = 0;
  checkboxes.forEach((checkbox: any) => {
    if (checkbox.checked) {
      checkedCount++;
    }
  });
  this.selectedCheckboxesCount = checkedCount;
  
  if (isChecked) {
      // If checked, add the asset ID to the checkedAssetIds array
      this.checkedAssetIds.push(rowId);
  } else {
      // If unchecked, remove the asset ID from the checkedAssetIds array
      this.checkedAssetIds = this.checkedAssetIds.filter(id => id !== rowId);
  }
  this.updateDeleteAllButtonVisibility();


}

updateDeleteAllButtonVisibility() {
  const deleteAllButton = document.getElementById('delete_all');
  if (deleteAllButton) {
    if (this.headerCheckboxChecked || this.selectedCheckboxesCount > 1) {
      deleteAllButton.style.display = 'block';
    } else {
      deleteAllButton.style.display = 'none';
    }
  }
}




  ngOnInit(): void {
    
    //Sidebar open
    this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    this.getAllAssets();

    //validators
    this.assetForm = this.fb.group({
      assetName: ['', Validators.required],
      assetClassification: ['Furniture', Validators.required],
      assetCategory: ['Movable' , Validators.required],
      department: ['Admin Block Co-ordinators' , Validators.required],
      location: ['N30' , Validators.required],
      model: ['' , Validators.required],
      assetSerialNumber: ['' , Validators.required],
      dateOfInclusion: ['' , Validators.required],
      manufacturedBy: ['' , Validators.required],
      // assetcode: ['' , Validators.required],
      capacity: ['', Validators.required],
      quantity: ['' , Validators.required],
      description: ['' , Validators.required],
      assetImage: [''],
      storeInwardNo: ['' , Validators.required],
      storeInwardCopy: [''],
      deptGatepassNo: ['' , Validators.required],
      departmentGatepassCopy: [''],
      warrantyNumber: ['' , Validators.required],
      warrantyExpiryDate: ['' , Validators.required],
      warrantyCopy: [''],
      insuranceNumber: ['' , Validators.required],
      insuranceExpiryDate: ['' , Validators.required],
      insuranceCopy: [''],
      spareMrn: ['' , Validators.required],
      scrapeMrn: ['' , Validators.required],
      assetWorkingStatus: ['' , Validators.required],
      purchaseAndDisposalApprovalCopy: [''],
      purchaseOrderNo: ['' , Validators.required],
      purchaseOrderCopy: [''],
      dateOfPurchase: ['' , Validators.required],
      organization: ['' , Validators.required],
      invoiceNumber: ['' , Validators.required],
      invoiceCopy: [''],
      price: ['' , Validators.required],
      vendorName: ['' , Validators.required]
    });
    //Edit asset
    this.editAsset = this.fb.group({
      assetName: [''],
      department: [''],
      category: [''],
      // assetCode: [''],
      location: ['']
    });

  }

  //Fetching all asset values
  getAllAssets(){
    console.log(this.assets);

    this.mainService.assetServiceGet().subscribe((resultData: any) =>
    {
      this.assets = resultData.data;
      this.initDataTable();
      console.log(this.assets);

      const headerCheckbox = document.getElementById('headerCheckbox') as HTMLInputElement;
      headerCheckbox.disabled = this.assets.length === 0;

    });

  }

  // initDataTable(): void {
  //   $(document).ready(() => {

  //     const table = $('#example').DataTable();

  //     // Check if DataTable instance exists and destroy it
  //     if ($.fn.DataTable.isDataTable('#example')) {
  //       table.destroy();
  //     }

  //     $('#example').DataTable({
  //       lengthChange:false,
  //       paging:false,
  //       data: this.assets,
  //       columns: [
  //         { data: null, orderable: false, render: function (data: any, type: any, row: any, meta: any) {
  //           // Render the checkbox column
  //           return '<input type="checkbox" class="bodyCheckbox" (change)="bodyCheckboxChanged($event, ' + row.id + ')">';
  //         }},
  //         { data: 'asset_name' },
  //         { data: 'asset_code' },
  //         { data: 'asset_department' },
  //         { data: 'asset_location' },
  //         { data: 'asset_category' },
  //         // { data: null, orderable: false, render: function (data: any, type: any, row: any, meta: any) {
  //         //   // Render the action column with edit and delete buttons
  //         //   // return '<a href="#" data-toggle="modal" data-target="#editAsset" (click)="openEditModal(' + JSON.stringify(row) + ')"><i class="bx bx-pencil mr-4"></i></a>' +
  //         //   //        '<a href="#" (click)="delete(' + JSON.stringify(row) + ')"><i class="bx bx-trash-alt"></i></a>';

  //         //   return '<a href="#" data-toggle="modal" data-target="#editAsset" (click)="openEditModal(' + JSON.stringify(row) + ')"><i class="bx bx-pencil mr-4 action_icon"></i></a>' +
  //         //   '<a href="#" (click)="delete(' + JSON.stringify(row) + ')"><i class="bx bx-trash-alt action_icon"></i></a>';
  //         // }}
  //         { data: null, orderable: false, render: function (data: any, type: any, row: any, meta: any) {
  //           // Render the action column with edit and delete buttons
  //           return '<a href="#" data-toggle="modal" data-target="#editAsset" (click)="openEditModal(' + row.id + ')"><i class="bx bx-pencil mr-4 action_icon"></i></a>' +
  //                  '<a href="#" (click)="delete(' + row.id + ')"><i class="bx bx-trash-alt action_icon"></i></a>';
  //       }}
  //       ],
  //       language: {
  //         info: '', // This will hide the "Showing 1 to 2 of 2 entries" message
  //         infoEmpty: '',
  //         infoFiltered: '',
  //         zeroRecords: 'No matching records found',
  //         search: 'Search:',
  //         paginate: {
  //           first: 'First',
  //           last: 'Last',
  //           next: 'Next',
  //           previous: 'Previous'
  //         }
  //       },
  //       createdRow: function (row: Node, data: any, index: number) {
  //         // Apply CSS styles to the newly created row
  //         $(row).find('td').css({
  //           padding: '23px 10px',
  //           backgroundColor: index % 2 === 0 ? '#d4c1e0' : '#fff',
  //           color: '#11101D',
  //           opacity: '0.8'
  //         });
  
  //         // Apply hover effect
  //         $(row).hover(function() {
  //           $(row).css('opacity', '1');
  //         }, function() {
  //           $(row).css('opacity', '0.8');
  //         });

  //         $(row).find('.action_icon').css({
  //           color: '#11101D',
  //           transition: 'all 0.5s ease',
  //           fontSize: '18px'
  //         });
  //       }
  //     });

  //     const dataTableWrapper = $('#example_wrapper');

  //     const searchBox = dataTableWrapper.find('.dataTables_filter');
  //     searchBox.css('float', 'left');
  //     searchBox.css('margin-left', '20px'); 

  //     $('#example .bodyCheckbox').css({
  //       width: '17px',
  //       height: '17px',
  //       display: 'block',
  //       margin: '0 auto',
  //       accentColor: '#9f84c0'
  //     });

      
    
  //   });

    
  // }

  initDataTable(): void {
    $(document).ready(() => {

      const table = $('#example').DataTable();

      // Check if DataTable instance exists and destroy it
      if ($.fn.DataTable.isDataTable('#example')) {
        table.destroy();
      }
        // Initialize DataTable
       $('#example').DataTable({
            lengthChange: false,
            paging: false,
            data: this.assets,
            columns: [
                { data: null, orderable: false, render: function (data: any, type: any, row: any, meta: any) {
                    // Render the checkbox column
                    return '<input type="checkbox" class="bodyCheckbox" data-row-id="' + row.id + '">';
                }},
                { data: 'asset_name' },
                { data: 'asset_code' },
                { data: 'asset_department' },
                { data: 'asset_location' },
                { data: 'asset_category' },
                { data: null, orderable: false, render: function (data: any, type: any, row: any, meta: any) {
                    // Render the action column with edit and delete buttons
                    return '<a href="#" data-toggle="modal" data-target="#editAsset" data-row-id="' + row.id + '" class="edit-btn"><i class="bx bx-pencil mr-4 action_icon"></i></a>' +
                           '<a href="#" class="delete-btn" data-row-id="' + row.id + '"><i class="bx bx-trash-alt action_icon"></i></a>';
                    
                }}
            ],
            language: {
                info: '', // This will hide the "Showing 1 to 2 of 2 entries" message
                infoEmpty: '',
                infoFiltered: '',
                zeroRecords: 'No matching records found',
                search: 'Search:',
                paginate: {
                    first: 'First',
                    last: 'Last',
                    next: 'Next',
                    previous: 'Previous'
                },
                emptyTable: 'No data available',
            },
            createdRow: function (row: Node, data: any, index: number) {
                // Apply CSS styles to the newly created row
                $(row).find('td').css({
                    padding: '23px 10px',
                    backgroundColor: index % 2 === 0 ? '#d4c1e0' : '#fff',
                    color: '#11101D',
                    opacity: '0.8'
                });
  
                // Apply hover effect
                $(row).hover(function () {
                    $(row).css('opacity', '1');
                }, function () {
                    $(row).css('opacity', '0.8');
                });
  
                $(row).find('.action_icon').css({
                    color: '#11101D',
                    transition: 'all 0.5s ease',
                    fontSize: '18px'
                });
            }
        });
  
        // Move search box to the left
        const dataTableWrapper = $('#example_wrapper');
        const searchBox = dataTableWrapper.find('.dataTables_filter');
        searchBox.css('float', 'left');
        searchBox.css('margin-left', '20px');
  
        // Checkbox change event
        $('#example').on('change', '.bodyCheckbox', (event:any) => {
            // Handle checkbox change
            const rowId = $(event.target).data('row-id');
            this.bodyCheckboxChanged(event.target, rowId);
        });

      
  
        // Edit button click event
        // $('#example').on('click', '[data-target="#editAsset"]', (event:any) => {
        //     // Handle edit button click
        //     const rowId = $(event.currentTarget).data('row-id');
        //     this.openEditModal(rowId);
        // });

        // Edit button click event
$('#example').on('click', '.edit-btn', (event:any) => {
  // Prevent default link behavior
  event.preventDefault();
  // Retrieve the row id from the data attribute
  const rowId = $(event.currentTarget).data('row-id');
  // Find the corresponding row data based on the id
  const rowData = this.assets.find((asset: any) => asset.id === rowId);
  // Now you have access to the row details in the rowData object
  // console.log('Row details:', rowData);
  // Implement your logic here
  // For example, you can open a modal and populate it with the row details
  this.openEditModal(rowData);
});

  
        // Delete button click event
        // $('#example').on('click', '.delete-btn', (event:any) => {
        //     // Handle delete button click
        //     const rowId = $(event.currentTarget).data('row-id');
        //     this.delete(rowId);
        // });

        $('#example').on('click', '.delete-btn', (event:any) => {
          // Prevent default behavior of the anchor tag
          event.preventDefault();
          
          // Retrieve the row ID from the data attribute
          const rowId = $(event.currentTarget).data('row-id');
          
          // Check if the row ID is valid
          if (rowId) {
              // Call the delete function
              this.delete(rowId);
          } else {
              console.error('Row ID not found.');
          }
      });

        $('#example .bodyCheckbox').css({
          width: '17px',
          height: '17px',
          display: 'block',
          margin: '0 auto',
          accentColor: '#9f84c0'
        });
    });
  }
  
  

  //Import Assets file
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  
  onFileImported(event: any) {
    this.file = event.target.files[0];

    if (this.file) {

      const formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);

      console.log(formData);

      this.mainService.assetServiceFileUpload(formData)
      .subscribe({
        next: (res) => {
            this.toastr.success('File Imported Successfully');
            this.getAllAssets();
        },
        error: (err) => {
            console.log(err);
        }
      });
    } 
  }

  importAssets(){
    document.getElementById('fileInput')?.click();
  }

  //Open Add asset modal
  openAddAssetModal(){
    const modal = $('#addAsset');
    modal.addClass('animate__backInDown').removeClass('animate__backOutDown');
  }

  

  //Multiple delete
  // deleteAll(){
  //   Swal.fire({
  //     title: 'Are you sure to delete all assets?',
  //     text: 'You will not be able to recover these assets!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#9f84c0',
  //     confirmButtonText: 'Yes, delete all!'
  //   }).then((result) => {
  //     if (result.isConfirmed){
  //       const headerCheckbox = document.getElementById('headerCheckbox') as HTMLInputElement;
  //       headerCheckbox.checked = false;
  //       $('#delete_all').hide();

  //       if (this.checkedAssetIds.length === 0) {
  //         return;
  //       }

  //       this.mainService.deleteRows(this.checkedAssetIds).subscribe(
  //         () => {
  //           this.toastr.success("Selected Assets Deleted Succesfully");
  //           this.getAllAssets();
  //           this.checkedAssetIds = [];
  //         },
  //         error => {
  //           console.error('Error deleting rows:', error);
  //           this.toastr.error("Failed to Delete Selected Assets")
  //         }
  //       );
  //     }
  //   });
  // }

  deleteAll(): void {
    // Confirm deletion with the user
    Swal.fire({
      title: 'Are you sure to delete all assets?',
      text: 'You will not be able to recover these assets!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#9f84c0',
      confirmButtonText: 'Yes, delete all!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Checked asset ids:', this.checkedAssetIds);
        // Call the deleteRows method with the checked asset IDs
        if (this.checkedAssetIds.length === 0) {
          // If no assets are checked, show an error message
          this.toastr.error("No assets selected for deletion");
          return;
        }
  
        this.mainService.deleteRows(this.checkedAssetIds).subscribe(
          () => {
            // On successful deletion, display success message and update asset list
            this.toastr.success("Selected Assets Deleted Successfully");
            this.getAllAssets();
            // Reset the checkedAssetIds array
            this.checkedAssetIds = [];
            const headerCheckbox = document.getElementById('headerCheckbox') as HTMLInputElement;
                    headerCheckbox.checked = false;
                    const deleteAllButton = document.getElementById('delete_all');
                    if (deleteAllButton) {
                        deleteAllButton.style.display = 'none';
                    }

          },
          error => {
            // If an error occurs during deletion, display error message
            console.error('Error deleting rows:', error);
            this.toastr.error("Failed to Delete Selected Assets");
          }
        );
      }
    });
  }
  
  


  //Dismiss the modal
  dismissModal(): void{
    const modal = $('#editAsset');
    modal.removeClass('animate__backInDown').addClass('animate__backOutDown');
    // modal.removeClass('animate__backOutDown');

    const modal1 = $('#addAsset');
    modal1.removeClass('animate__backInDown').addClass('animate__backOutDown');
    this.resetForm();
    this.clearSelectedFile();
    this.clearSelectedFiles();

    $('#navTab a:first').tab('show');

  }

  //Resetting form
  resetForm(): void {
    this.assetForm.reset({
      assetClassification: 'Furniture',
      department: 'Admin Block Co-ordinators',
      assetCategory: 'Movable',
      location: 'N30'
    });
  }

  //Add asset into database
  addAsset(): void {
    console.log(this.assetForm.value)
    if (this.isFormEmpty()) {
      this.toastr.error('Please add information before adding Asset');
      $('#addAsset').modal('hide');
    } 
    else {
      const formData = new FormData();
      formData.append('assetName', this.assetForm.value.assetName);
      formData.append('assetClassification', this.assetForm.value.assetClassification);
      formData.append('assetCategory', this.assetForm.value.assetCategory);
      formData.append('department', this.assetForm.value.department);
      formData.append('location', this.assetForm.value.location);
      formData.append('model', this.assetForm.value.model);
      formData.append('assetSerialNumber', this.assetForm.value.assetSerialNumber);
      formData.append('dateOfInclusion', this.assetForm.value.dateOfInclusion);
      formData.append('manufacturedBy', this.assetForm.value.manufacturedBy);
      formData.append('capacity', this.assetForm.value.capacity);
      formData.append('quantity', this.assetForm.value.quantity);
      formData.append('description', this.assetForm.value.description);
      formData.append('assetImage', this.assetImage as Blob);
      formData.append('storeInwardNo', this.assetForm.value.storeInwardNo);
      formData.append('storeInwardCopy', this.storeInwardCopy as Blob);
      formData.append('deptGatepassNo', this.assetForm.value.deptGatepassNo);
      formData.append('departmentGatepassCopy', this.departmentGatepassCopy as Blob);
      formData.append('warrantyNumber', this.assetForm.value.warrantyNumber);
      formData.append('warrantyExpiryDate', this.assetForm.value.warrantyExpiryDate);
      formData.append('warrantyCopy', this.warrantyCopy as Blob);
      formData.append('insuranceNumber', this.assetForm.value.insuranceNumber);
      formData.append('insuranceExpiryDate', this.assetForm.value.insuranceExpiryDate);
      formData.append('insuranceCopy', this.insuranceCopy as Blob);
      formData.append('spareMrn', this.assetForm.value.spareMrn);
      formData.append('scrapeMrn', this.assetForm.value.scrapeMrn);
      formData.append('assetWorkingStatus', this.assetForm.value.assetWorkingStatus);
      formData.append('purchaseAndDisposalApprovalCopy', this.purchaseAndDisposalApprovalCopy as Blob);
      formData.append('purchaseOrderNo', this.assetForm.value.purchaseOrderNo);
      formData.append('purchaseOrderCopy', this.purchaseOrderCopy as Blob);
      formData.append('dateOfPurchase', this.assetForm.value.dateOfPurchase);
      formData.append('organization', this.assetForm.value.organization);
      formData.append('invoiceNumber', this.assetForm.value.invoiceNumber);
      formData.append('invoiceCopy', this.invoiceCopy as Blob);
      formData.append('price', this.assetForm.value.price); 
      formData.append('vendorName', this.assetForm.value.vendorName); 

      console.log(formData)

      this.mainService.assetService(formData)
      .subscribe({
        next:(res)=>{
          this.toastr.success('Asset Added Successfully');
          $('#addAsset').modal('hide');
          this.resetForm();
          this.clearSelectedFile();
          this.clearSelectedFiles();
          this.getAllAssets();
        },
        error:(err)=>{
          // console.log(err);
          this.toastr.error('Please fill all the fields');
          $('#addAsset').modal('hide');
          this.resetForm();
          this.clearSelectedFile();
          this.clearSelectedFiles();
          this.getAllAssets();
        }
      })
    } 
  }

  //Checking the form empty
  isFormEmpty(): boolean{
    if (this.assetForm.dirty || this.assetForm.touched) {
      return false;
    }
    return true;
  }

  // Clear the selected file names
  clearSelectedFile() {
    this.selectedFile = null;
  }

  selectedFiles: any = {};

  clearSelectedFiles() {
    this.selectedFiles = {
      storeInwardCopy: '',
      departmentGatepassCopy: '',
      warrantyCopy: '',
      insuranceCopy: '',
      purchaseAndDisposalApprovalCopy: '',
      purchaseOrderCopy: '',
      invoiceCopy: ''
    };
  }

  //Drag and drop
  @HostListener('drop', ['$event']) onDrop(event: DragEvent){
    event.preventDefault();
    if (event.dataTransfer) {
      this.handleFile(event.dataTransfer.files);
    }
  }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent){
    event.preventDefault();
  }

  //File handling
  handleFile(files: FileList){
    if (files.length > 0) {
      this.selectedFile = files[0];
      console.log('Dropped File:', this.selectedFile);
    }
  }

  //Get file size
  getFileSize(size: number): string{
    if (size === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  //Open file input
  openFileInput(){
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  //File selection
  onFileSelected(event: any){
    this.assetImage = event.target.files[0];
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
      console.log('Selected File:', this.selectedFile);
    }
  }

  onFileSelected1(event: any, fieldName: string){
    const file = event.target.files[0];
    this.selectedFiles[fieldName] = file ? file.name : null;
  }

  onFileSelectedSIC(event: any){
    this.storeInwardCopy = event.target.files[0];
  }
  onFileSelectedDGC(event: any){
    this.departmentGatepassCopy = event.target.files[0];
  }
  onFileSelectedWC(event: any){
    this.warrantyCopy = event.target.files[0];
  }
  onFileSelectedIC(event: any){
    this.insuranceCopy = event.target.files[0];
  }
  onFileSelectedPADAC(event: any){
    this.purchaseAndDisposalApprovalCopy = event.target.files[0];
  }
  onFileSelectedPOC(event: any){
    this.purchaseOrderCopy = event.target.files[0];
  }
  onFileSelectedI(event: any){
    this.invoiceCopy = event.target.files[0];
  }

  selectedAssetIndex: number = -1; 

  @ViewChild('editModal') editModal!: ElementRef;


  //Open edit modal
  // openEditModal(data: any): void{

  //   console.log(data);
  //   alert(data);
  //   this.editAsset.patchValue({
  //     assetName: data.asset_name,
  //     department: data.asset_department,
  //     location: data.asset_location,
  //     category: data.asset_category
  //   });
  //   this.selectedAssetIndex = data.id

  //   const modal = $('#editAsset');
  //   modal.addClass('animate__backInDown').removeClass('animate__backOutDown');

  // }

  previousAsset: any;

  // openEditModal(data: any): void {
  //   // Log all values in the row
  //   // console.log('All values in the row:', data);
  
  //   // Populate the edit form with the row data
  //   this.editAsset.patchValue({
  //     assetName: data.asset_name,
  //     department: data.asset_department,
  //     category: data.asset_category,
  //     location: data.asset_location,
  //     // Add other fields as needed
  //   });
  
  //   // Store the selected asset index for update
  //   this.selectedAssetIndex = data.id;
  
  //   // Show the edit modal
  //   const modal = $('#editAsset');
  //   modal.addClass('animate__backInDown').removeClass('animate__backOutDown');
  // }
  

  

  
  
  
  

  //Single delete
  delete(rowId: any){
    Swal.fire({
      title:'Are you sure to delete?',
      text:'You will not be able to recover this asset!',
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor:'#d33',
      cancelButtonColor:'#9f84c0',
      confirmButtonText:'Yes, delete it!'
    }).then((result) =>{
      if (result.isConfirmed){
        this.mainService.assetServiceDelete(rowId)
        .subscribe(
          (resultData) => {
            console.log(resultData);
            // Display success message
            this.toastr.success('Asset Deleted Successfully');
            // Reload or update the asset list
            this.getAllAssets();
        },
        (error) => {
            console.error('Error deleting asset:', error);
            // Display error message
            this.toastr.error('Failed to delete asset');
        }
        )
      }
    });
  }

  //Update asset
  // updateAsset(): void {

  //   let bodyData = {
  //     "assetName" : this.editAsset.value.assetName,
  //     "assetCategory" : this.editAsset.value.category,
  //     "department" : this.editAsset.value.department,
  //     "location" : this.editAsset.value.location,
  //   }

  //   console.log(bodyData);

  //   this.mainService.assetServiceUpdate(this.selectedAssetIndex, bodyData)
  //   .subscribe({
  //     next:(res)=>{
  //       if (this.isAssetUpdated(this.assets[this.selectedAssetIndex], bodyData)) {
  //         this.toastr.success('Asset Updated Successfully');
  //       } else {
  //         this.toastr.error('No changes found');
  //       }
  //       $('#editAsset').modal('hide');
  //       this.resetForm();
  //       this.clearSelectedFile();
  //       this.clearSelectedFiles();
  //       this.getAllAssets();
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //     }
  //   })
  // }

  // isAssetUpdated(previousAsset: any, updatedAsset: any): boolean{
  //   for (const key in previousAsset){
  //     if (previousAsset.hasOwnProperty(key) && updatedAsset.hasOwnProperty(key)){
  //       if (previousAsset[key] !== updatedAsset[key]){
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }


//   openEditModal(data: any): void {
//     const previousAsset = this.assets.find(asset => asset.id === data.id);
//     if (!previousAsset) {
//       console.error('Previous asset not found.');
//       return;
//     }
//     this.previousAsset = previousAsset;

//     this.editAsset.patchValue({
//       assetName: data.asset_name,
//       department: data.asset_department,
//       category: data.asset_category,
//       location: data.asset_location,
//       // Add other fields as needed
//     });

//     this.selectedAssetIndex = data.id;

//     const modal = $('#editAsset');
//     modal.addClass('animate__backInDown').removeClass('animate__backOutDown');
//   }

  

//   updateAsset(): void {
//     const bodyData = {
//       assetName: this.editAsset.value.assetName,
//       assetCategory: this.editAsset.value.category,
//       department: this.editAsset.value.department,
//       location: this.editAsset.value.location,
//       // Add other fields as needed
//     };

//     console.log(bodyData);

//     if (this.isAssetUpdated(bodyData)) {
//       this.mainService.assetServiceUpdate(this.selectedAssetIndex, bodyData)
//         .subscribe({
//           next: (res) => {
//             this.toastr.success('Asset Updated Successfully');
//             $('#editAsset').modal('hide');
//             this.resetForm();
//             this.clearSelectedFile();
//             this.clearSelectedFiles();
//             this.getAllAssets();
//           },
//           error: (err) => {
//             console.error('Error updating asset:', err);
//           }
//         });
//     } else {
//       this.toastr.error('No changes found');
//     }
//   }

 
//   isAssetUpdated(updatedAsset: any): boolean {
//     if (!this.previousAsset) {
//         console.error('Previous asset not defined.');
//         return false;
//     }

//     console.log('Previous asset', this.previousAsset);
//     console.log('Updated asset', updatedAsset);

//     // Compare specific properties for changes
//     if (this.previousAsset.asset_name !== updatedAsset.assetName ||
//         this.previousAsset.asset_category !== updatedAsset.assetCategory ||
//         this.previousAsset.asset_department !== updatedAsset.department ||
//         this.previousAsset.location !== updatedAsset.location) {
//         return true;
//     }

//     // Check if no changes were detected
//     console.log('No changes found.');
//     return false;
// }

openEditModal(data: any): void {
  const previousAsset = this.assets.find(asset => asset.id === data.id);
  if (!previousAsset) {
    console.error('Previous asset not found.');
    return;
  }
  this.previousAsset = previousAsset;

  this.editAsset.patchValue({
    assetName: data.asset_name,
    department: data.asset_department,
    category: data.asset_category,
    location: data.asset_location,
    // Add other fields as needed
  });

  this.selectedAssetIndex = data.id;

  const modal = $('#editAsset');
  modal.addClass('animate__backInDown').removeClass('animate__backOutDown');
}

updateAsset(): void {
  const bodyData = {
    assetName: this.editAsset.value.assetName,
    assetCategory: this.editAsset.value.category,
    department: this.editAsset.value.department,
    location: this.editAsset.value.location,
    // Add other fields as needed
  };

  console.log(bodyData);

  // Check if any changes are made in the form fields
  if (!this.isAssetUpdated(bodyData)) {
    this.toastr.error('No changes found');
    $('#editAsset').modal('hide');
    return; // No need to proceed further if no changes found
  }

  this.mainService.assetServiceUpdate(this.selectedAssetIndex, bodyData)
    .subscribe({
      next: (res) => {
        this.toastr.success('Asset Updated Successfully');
        $('#editAsset').modal('hide');
        this.resetForm();
        this.clearSelectedFile();
        this.clearSelectedFiles();
        this.getAllAssets();
      },
      error: (err) => {
        console.error('Error updating asset:', err);
      }
    });
}


isAssetUpdated(updatedAsset: any): boolean {
  if (!this.previousAsset) {
    console.error('Previous asset not defined.');
    return false;
  }

  // Compare specific properties for changes
  if (
    this.previousAsset.asset_name !== updatedAsset.assetName ||
    this.previousAsset.asset_category !== updatedAsset.assetCategory ||
    this.previousAsset.asset_department !== updatedAsset.department ||
    this.previousAsset.asset_location !== updatedAsset.location
  ) {
    console.log('Changes found.');
    return true;
  }

  // If no changes were detected
  console.log('No changes found.');
  return false;
}







  //Close the modal
  closeModal(){
    $('#editAsset').modal('hide');
  }
  
}
