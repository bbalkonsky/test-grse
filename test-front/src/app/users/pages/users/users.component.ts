import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {Router} from '@angular/router';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../../../../environments/environment';
import {User} from '../../../core/model/user.interafce';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy{
  webSocket: WebSocketSubject<any> = webSocket(environment.webSocketURL);
  users: User[];
  notifier = new Subject();

  constructor(private userService: UserService,
              private router: Router,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.notifier))
      .subscribe(users => this.users = users);

    this.webSocket.subscribe(
      msg => {
        if (this.users) {
          msg.forEach(wsUser => {
            const userId = wsUser.id;
            const userIdx = this.users.findIndex(user => user.id === userId);

            if (userIdx !== -1) {
              this.users[userIdx].status = wsUser.status;
              this.users[userIdx].lastSeen = wsUser.lastSeen;
            }
          });
        }
      },
      err => console.log(err),
      () => console.log('complete')
    );
  }

  navigateToUser(userId): void {
    this.router.navigate(['/users', userId]);
  }

  ngOnDestroy(): void {
    this.webSocket.complete();
    this.notifier.next();
    this.notifier.complete();
  }

}
