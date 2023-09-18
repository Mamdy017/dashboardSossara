import { Component, OnInit } from '@angular/core';
import {
  ButtonsConfig,
  ButtonsStrategy,
  // GalleryService,
  Image,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN,
  ButtonEvent,
  ButtonType,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  ModalGalleryService,
  PlainLibConfig,
  LineLayout,
  ModalGalleryRef,
  // AdvancedLayout,
} from '@ks89/angular-modal-gallery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public url: any;

  images: Image[] = [
    new Image(
      0,
      {
        img: 'assets/images/other-images/profile-style-img.png',
        extUrl: 'http://www.google.com'
      })
  ]
  images1: Image[] = [
    new Image(
      0,
      {
        img: 'assets/images/blog/img.png',
        extUrl: 'http://www.google.com'
      })
  ]

  constructor(private modalGalleryService: ModalGalleryService) {}

  libConfigPlainGalleryRow: PlainLibConfig = {
    plainGalleryConfig: {
      strategy: PlainGalleryStrategy.ROW,
      layout: new LineLayout({ width: '80px', height: '80px' }, { length: 2, wrap: true }, 'flex-start')
    }
  };

  onShow(id: number, index: number, images: Image[] = this.images): void {
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images,
      currentImage: images[index]
    }) as ModalGalleryRef;
  }

  buttonsConfigDefault: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  };
  buttonsConfigSimple: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  };
  buttonsConfigAdvanced: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.ADVANCED
  };
  buttonsConfigFull: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.FULL
  };
  buttonsConfigCustom: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      KS_DEFAULT_BTN_FULL_SCREEN,
      KS_DEFAULT_BTN_EXTURL,
      KS_DEFAULT_BTN_DOWNLOAD,
      KS_DEFAULT_BTN_CLOSE
    ]
  };

  // customPlainGalleryRowDescConfig: PlainGalleryConfig = {
  //   strategy: PlainGalleryStrategy.CUSTOM,
  //   layout: new AdvancedLayout(-1, true)
  // };

  // openImageModalRowDescription(image: Image) {
  //   const index: number = this.getCurrentIndexCustomLayout(image, this.images);
  //   this.customPlainGalleryRowDescConfig = Object.assign({}, this.customPlainGalleryRowDescConfig, { layout: new AdvancedLayout(index, true) });
  // }

  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  };
  onButtonAfterHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }
  }

  onCustomButtonBeforeHook(event: ButtonEvent, galleryId: number | undefined) {
    if (!event || !event.button) {
      return;
    }

    if (event.button.type === ButtonType.CUSTOM) {
      this.addRandomImage();

      setTimeout(() => {
        // this.galleryService.openGallery(galleryId, this.images.length - 1);
      }, 0);
    }
  }

  onCustomButtonAfterHook(event: ButtonEvent, galleryId: number | undefined) {
    if (!event || !event.button) {
      return;
    }
  }

  addRandomImage() {
    const imageToCopy: Image = this.images[Math.floor(Math.random() * this.images.length)];
    const newImage: Image = new Image(this.images.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
    this.images = [...this.images, newImage];
  }

  //FileUpload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

  ngOnInit() { }
}

