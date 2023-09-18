import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageGalleryComponent implements OnInit {

  items: GalleryItem[];

  imageData = data;

  constructor(public gallery: Gallery, public lightbox: Lightbox) {
  }

  ngOnInit() {

    /** Basic Gallery Example */

    // Creat gallery items
    this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));


    /** Lightbox Example */

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }
}

const data = [
  {
    srcUrl: 'assets/images/lightgallry/01.jpg',
    previewUrl: 'assets/images/lightgallry/01.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/02.jpg',
    previewUrl: 'assets/images/lightgallry/02.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/03.jpg',
    previewUrl: 'assets/images/lightgallry/03.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/04.jpg',
    previewUrl: 'assets/images/lightgallry/04.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/05.jpg',
    previewUrl: 'assets/images/lightgallry/05.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/06.jpg',
    previewUrl: 'assets/images/lightgallry/06.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/07.jpg',
    previewUrl: 'assets/images/lightgallry/07.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/08.jpg',
    previewUrl: 'assets/images/lightgallry/08.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/09.jpg',
    previewUrl: 'assets/images/lightgallry/09.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/010.jpg',
    previewUrl: 'assets/images/lightgallry/010.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/011.jpg',
    previewUrl: 'assets/images/lightgallry/011.jpg'
  },
  {
    srcUrl: 'assets/images/lightgallry/012.jpg',
    previewUrl: 'assets/images/lightgallry/012.jpg'
  }
]






