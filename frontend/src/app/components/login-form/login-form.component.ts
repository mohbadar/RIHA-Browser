import {Component, OnInit} from '@angular/core';
import {ActiveOrganizationChooserComponent} from '../active-organization-chooser/active-organization-chooser.component';
import {NoOrganizationModalComponent} from '../no-organization-modal/no-organization-modal.component';
import 'rxjs/add/operator/toPromise';
import {EnvironmentService} from '../../services/environment.service';
import {ModalHelperService} from '../../services/modal-helper.service';
import {Router} from '@angular/router';
import {Environment} from '../../models/environment';
import {SessionHelperService} from '../../services/session-helper.service';
import {GeneralHelperService} from '../../services/general-helper.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  alertConf: any = null;

  login(){
    this.environmentService.doLogin().then(res => {
      this.environmentService.loadEnvironmentData().then(res => {
        this.sessionHelper.refreshSessionTimer();
        let prevLocation = this.router.routerState.snapshot.root.queryParams.fromUrl;
        if (prevLocation){
          this.router.navigate([decodeURIComponent(prevLocation)]);
        } else {
          this.router.navigate(['/']);
        }
        let user = this.environmentService.getActiveUser();

        if (user == null) {
          return;
        }

        let organizations = user.getOrganizations();
        if (organizations.length > 1){
          this.modalService.open(ActiveOrganizationChooserComponent);
        } else if (organizations.length == 1){
          this.environmentService.setActiveOrganization(organizations[0].code).then(
            res => {
              this.environmentService.globalEnvironment = new Environment(res.json())
            }, err => {}
          );
        } else if (organizations.length == 0) {
          this.modalService.open(NoOrganizationModalComponent);
        }
      });
    }, err => {
      this.alertConf = {
        type: 'danger',
        heading: 'Viga',
        text: 'Viga sisse logimisel'
      };
      setTimeout(()=> this.alertConf = null, 5000)
    });
    return false;
  }

  isLoggedIn(){
    return this.environmentService.getActiveUser() != null;
  }

  constructor(private environmentService: EnvironmentService,
              private modalService: ModalHelperService,
              private sessionHelper: SessionHelperService,
              private generalHelperService: GeneralHelperService,
              private router: Router) {

    this.login();

  }

  getCurrentUrl() {
    return this.router.url;
  }

  ngOnInit() {
    this.generalHelperService.setRihaPageTitle('Portaali sisenemine');
  }

}
