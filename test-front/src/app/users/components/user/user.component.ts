import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {UserService} from '../../shared/user.service';
import {EMPTY, Observable, Subject} from 'rxjs';
import {User} from '../../../core/model/user.interafce';
import {NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  isRedacting = false;
  user$: Observable<User>;
  notifier = new Subject();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.user$ = this.route.paramMap.pipe(
      takeUntil(this.notifier),
      switchMap(param => param.has('user') ? this.userService.getUserById(param.get('user')) : EMPTY)
    );
  }

  editUser(): void {
    this.isRedacting = !this.isRedacting;
  }

  saveUser(userId, userFullName): void {
    this.userService
      .updateUser(userId, userFullName)
      .pipe(takeUntil(this.notifier))
      .subscribe(i => {
        this.isRedacting = !this.isRedacting;
        this.notificationService.createNotification('Пользователь сохранен!');
      });
  }

  cancelEdit(): void {
    if (this.isRedacting) {
      this.isRedacting = false;
    } else {
      this.router.navigate(['/users']);
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

}
