import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WordListComponentComponent } from './components/word-list-component/word-list-component.component';
import { WordResultComponent } from './components/word-result/word-result.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'find/definition/:word', component: WordResultComponent},
  { path: 'find/definition', component: WordResultComponent},
  { path: 'find/list/:word', component: WordListComponentComponent},
  { path: 'find/list', component: WordListComponentComponent},
  { path: 'error404/', component: PageNotFoundComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
