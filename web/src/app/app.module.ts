import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { ShowPostsComponent } from './post/show-posts/show-posts.component';
import { CreateEditPostComponent } from './post/create-edit-post/create-edit-post.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownToggleDirective } from './directives/dropdown-toggle.directive';
import { PaginationComponent } from './common/pagination/pagination.component';

const appRoutes: Routes = [
  { path: '', component: ShowPostsComponent },
  { path: 'createPost', component: CreateEditPostComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ShowPostsComponent,
    CreateEditPostComponent,
    LoginComponent,
    SignupComponent,
    DropdownToggleDirective,
    PaginationComponent,
  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
