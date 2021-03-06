import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { CreateEditPostComponent } from "./post/create-edit-post/create-edit-post.component";
import { ShowPostsComponent } from "./post/show-posts/show-posts.component";
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', component: ShowPostsComponent },
  { path: 'createPost', component: CreateEditPostComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
