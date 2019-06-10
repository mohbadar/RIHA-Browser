import { Component, OnInit, DoCheck, KeyValueDiffers } from '@angular/core';
import { UserMatrix } from '../../models/user-matrix';
import { EnvironmentService } from '../../services/environment.service';
import { GridData } from '../../models/grid-data';
import { SystemsService } from '../../services/systems.service';
import { GeneralHelperService } from '../../services/general-helper.service';

@Component({
  selector: 'app-producer-dashboard',
  templateUrl: './producer-dashboard.component.html',
  styleUrls: ['./producer-dashboard.component.scss']
})
export class ProducerDashboardComponent implements OnInit, DoCheck {

  public userMatrix: UserMatrix;
  public loaded: boolean = false;
  private differ: any;
  public gridData: GridData = new GridData();

  onPageChange(newPage): void{	
    this.gridData.page = newPage - 1;	
    this.getOwnOpenIssues();	
  }
  public onSortChange(property): void{
    this.gridData.changeSortOrder(property);
    this.getOwnOpenIssues();
  }

  private getOwnOpenIssues(){
    if (this.userMatrix.isLoggedIn && this.userMatrix.isOrganizationSelected) {
      this.systemsService.getActiveIssuesForOrganization(this.environmentService.getActiveUser().activeOrganization.code, this.gridData.sort).then(res =>{
        this.gridData.updateData(res.json());
        this.loaded = true;
      }, err => {
        this.helper.showError();
        this.loaded = true;
        let sortProperty = this.gridData.getSortProperty();
      if (sortProperty) {
        params.sort = sortProperty;
      }
      let sortOrder = this.gridData.getSortOrder();
      if (sortOrder) {
        params.dir = sortOrder;
      }
      if (page && page != 0) {
        params.page = page + 1;
      }
      });
    }
  }

  constructor(private differs: KeyValueDiffers,
              private helper: GeneralHelperService,
              private systemsService: SystemsService,
              private environmentService: EnvironmentService) {
    this.differ = differs.find({}).create(null);
    this.userMatrix = this.environmentService.getUserMatrix();
  }

  ngOnInit() {
    this.helper.setRihaPageTitle('Minu arutelud');
    this.gridData.changeSortOrder('latest_interaction');
    this.getOwnOpenIssues();
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.environmentService.globalEnvironment);
    if (changes && (this.loaded || !this.userMatrix.isOrganizationSelected)){
      this.userMatrix = this.environmentService.getUserMatrix();
      this.getOwnOpenIssues();
    }
  }

}
