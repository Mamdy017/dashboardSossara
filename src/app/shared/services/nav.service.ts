import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";
// import { faHome, faUser, faEcommerce, faWidget, faProject, faTable, faLayout, faOthers } from '@fortawesome/fontawesome-free-solid';


// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [

   
    {
      path: "/dashboard/admin",
      title: "Admin",
      icon: "home",
      type: "link",
      // bookmark: true,
    },
    {
      path: "/dashboard/super-admin",
      title: "Super Admin",
      icon: "home",
      type: "link",
      // bookmark: true,
    },

    {
      headTitle1: " ",
      headTitle2: "Ready To Use Apps.",
    },
    
    {
      path: "/user/team-details",
      title: "Agence",
      icon: "user",
      type: "link",
      // bookmark: true,
    },
    {
      title: "Agents",
      icon: "user",
      active: false,
      type: "link",
      path: "/table/datatable",
    },
    {
      title: "Blog",
      icon: "blog",
      active: false,
      type: "link",
      path: "/blog",
    },

    {
      title: "Biens immobiliers",
      type: "sub",
      icon: "user",
      active: false,
      children: [
        { path: "/ecommerce/products", title: "Product", type: "link" },
        {
          path: "/ecommerce/product/list",
          title: "Ventes",
          type: "link",
        },
        {
          path: "/ecommerce/product/list",
          title: "Location",
          type: "link",
        },
      ],
    },
    {
      title: "Widgets",
      icon: "widget",
      type: "sub",
      active: false,
      children: [{ path: "/widgets/chart", title: "Chart", type: "link" }],
    },
    {
      title: "Project",
      icon: "project",
      type: "sub",
      badgeType: "light-secondary",
      badgeValue: "New",
      active: false,
      children: [
        { path: "/project/list", title: "Project List", type: "link" },
        { path: "/project/create", title: "Create New", type: "link" },
      ],
    },



    {
      title: "Users",
      icon: "user",
      type: "sub",
      active: false,
      children: [
        { path: "/user/team-details", title: "All Users", type: "link" },
        { path: "/user/profile", title: "User Profile", type: "link" },
        { path: "/user/edit-profile", title: "Edit Profile", type: "link" },
      ],
    },


    {
      title: "Forms",
      icon: "form",
      type: "sub",
      active: false,
      children: [
        {
          title: "Form Controls",
          icon: "file-text",
          type: "sub",
          active: false,
          children: [
            {
              path: "/form/form-controls/validation",
              title: "Form Validation",
              type: "link",
            },
            {
              path: "/form/form-controls/inputs",
              title: "Base Inputs",
              type: "link",
            },
            {
              path: "/form/form-controls/checkbox-radio",
              title: "Checkbox & Radio",
              type: "link",
            },
            {
              path: "/form/form-controls/input-groups",
              title: "Input Groups",
              type: "link",
            },
            {
              path: "/form/form-controls/mega-options",
              title: "Mega Options",
              type: "link",
            },
          ],
        },
        {
          title: "Form Widgets",
          icon: "file-text",
          type: "sub",
          active: false,
          children: [
            {
              path: "/form/form-widgets/touchspin",
              title: "Touchspin",
              type: "link",
            },
            {
              path: "/form/form-widgets/ngselect",
              title: "Ng-Select",
              type: "link",
            },
            {
              path: "/form/form-widgets/switch",
              title: "Switch",
              type: "link",
            },
            {
              path: "/form/form-widgets/clipboard",
              title: "Clipboard",
              type: "link",
            },
          ],
        },
        {
          title: "Form Layout",
          icon: "file-text",
          type: "sub",
          active: false,
          children: [
            {
              path: "/form/form-layout/default-form",
              title: "Default Forms",
              type: "link",
            },
            {
              path: "/form/form-layout/form-wizard",
              title: "Form Wizard 1",
              type: "link",
            },
            {
              path: "/form/form-layout/form-wizard-two",
              title: "Form Wizard 2",
              type: "link",
            },
            {
              path: "/form/form-layout/form-wizard-three",
              title: "Form Wizard 3",
              type: "link",
            },
            {
              path: "/form/form-layout/form-wizard-four",
              title: "Form Wizard 4",
              type: "link",
            },
          ],
        },
      ],
    },
    {
      title: "Tables",
      icon: "table",
      type: "sub",
      active: false,
      children: [
        {
          title: "Bootstrap Tables",
          type: "sub",
          active: false,
          children: [
            {
              path: "/table/bootstrap-tables/basic",
              title: "Basic Table",
              type: "link",
            },
            {
              path: "/table/bootstrap-tables/table-components",
              title: "Table components",
              type: "link",
            },
          ],
        },
        {
          title: "Data table",
          active: false,
          type: "link",
          path: "/table/datatable",
        },
      ],
    },
    {
      title: "Cards",
      icon: "layout",
      type: "sub",
      active: false,
      children: [
        { path: "/cards/basic", title: "Basic Card", type: "link" },
        { path: "/cards/creative", title: "Creative Card", type: "link" },
        { path: "/cards/tabbed", title: "Tabbed Card", type: "link" },
        { path: "/cards/dragable", title: "Draggable Card", type: "link" },
      ],
    },

    {
      title: "Others",
      icon: "others",
      type: "sub",
      children: [
        {
          title: "Error Pages",
          type: "sub",
          active: false,
          children: [
            { path: "/error-page/error-400", title: "Error400", type: "link" },
            { path: "/error-page/error-401", title: "Error401", type: "link" },
            { path: "/error-page/error-403", title: "Error403", type: "link" },
            { path: "/error-page/error-404", title: "Error404", type: "link" },
            { path: "/error-page/error-500", title: "Error500", type: "link" },
            { path: "/error-page/error-503", title: "Error503", type: "link" },
          ],
        },
        {
          title: "Authentication",
          type: "sub",
          active: false,
          children: [
            {
              path: "/authentication/login/simple",
              title: "Login Simple",
              type: "link",
            },
            {
              path: "/authentication/login/image-one",
              title: "Login Image 1",
              type: "link",
            },
            {
              path: "/authentication/login/image-two",
              title: "Login Image 2",
              type: "link",
            },
            {
              path: "/authentication/login/validation",
              title: "Login Validation",
              type: "link",
            },
            {
              path: "/authentication/login/tooltip",
              title: "Login Tooltip",
              type: "link",
            },
            {
              path: "/authentication/login/sweetalert",
              title: "Login Sweetalert",
              type: "link",
            },
            {
              path: "/authentication/register/simple",
              title: "Register Simple",
              type: "link",
            },
            {
              path: "/authentication/register/image-one",
              title: "Register Image 1",
              type: "link",
            },
            {
              path: "/authentication/register/image-two",
              title: "Register Image 2",
              type: "link",
            },
            {
              path: "/authentication/register/register-wizard",
              title: "Register wizard",
              type: "link",
            },
            {
              path: "/authentication/unlock-user",
              title: "Unlock User",
              type: "link",
            },
            {
              path: "/authentication/forgot-password",
              title: "Forgot Password",
              type: "link",
            },
            {
              path: "/authentication/reset-password",
              title: "Reset Password",
              type: "link",
            },
          ],
        },
        {
          title: "Coming Soon",
          type: "sub",
          active: false,
          children: [
            {
              path: "/coming-soon/simple",
              title: "Coming Simple",
              type: "link",
            },
            {
              path: "/coming-soon/simple-with-bg-img",
              title: "Coming BG Image",
              type: "link",
            },
            {
              path: "/coming-soon/simple-with-bg-vid",
              title: "Coming BG Video",
              type: "link",
            },
          ],
        },
        {
          title: "Email templates",
          type: "sub",
          active: false,
          children: [
            {
              path: "http://admin.pixelstrap.com/cuba/theme/basic-template.html",
              title: "Basic Email",
              type: "extTabLink",
            },
            {
              path: "http://admin.pixelstrap.com/cuba/theme/email-header.html",
              title: "Basic With Header",
              type: "extTabLink",
            },
            {
              path: "http://admin.pixelstrap.com/cuba/theme/template-email.html",
              title: "Ecomerce Template",
              type: "extTabLink",
            },
            {
              path: "http://admin.pixelstrap.com/cuba/theme/template-email-2.html",
              title: "Email Template 2",
              type: "extTabLink",
            },
            {
              path: "http://admin.pixelstrap.com/cuba/theme/ecommerce-templates.html",
              title: "Ecommerce Email",
              type: "extTabLink",
            },
            {
              path: "http://admin.pixelstrap.com/cuba/theme/email-order-success.html",
              title: "Order Success",
              type: "extTabLink",
            },
          ],
        },
        {
          path: "/maintenance",
          title: "Maintenance",
          type: "link",
        },
      ],
    },
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
