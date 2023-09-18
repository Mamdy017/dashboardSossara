export interface OrderHistory {
    img?: string;
    name: string;
    size: string;
    color: string;
    articleNo: string;
    unit:string;
    price:string;
}

export const ORDERHISTORY: OrderHistory[] = [
    {
        img: 'assets/images/product/1.png',
        name: 'Long Top',
        size: 'M',
        color: 'Lavander',
        articleNo: '4215738',
        unit: '11',
        price: '$21'
    },
    {
        img: 'assets/images/product/13.png',
        name: 'Fancy Watch',
        size: '35 mm',
        color: 'Blue',
        articleNo: '5476182',
        unit: '11',
        price: '$10'
    },
    {
        img: 'assets/images/product/4.png',
        name: 'Man Shoes',
        size: '8',
        color: 'Black & White',
        articleNo: '1756457',
        unit: '11',
        price: '$ 18'
    },
    {
        img: 'assets/images/product/10.png',
        name: 'Ledis side bag',
        size: '22cm x 18cm',
        color: 'brown',
        articleNo: '7451725',
        unit: '1',
        price: '$13'
    },
    {
        img: 'assets/images/product/12.png',
        name: 'ledis slipper',
        size: '6',
        color: 'brown',
        articleNo: '4127421',
        unit: '1',
        price: '$6'
    },
    {
        img: 'assets/images/product/3.png',
        name: 'Fancy ledis Jacket',
        size: 'Xl',
        color: 'Light Gray',
        articleNo: '3581714',
        unit: '1',
        price: '$24'
    },
    {
        img: 'assets/images/product/2.png',
        name: 'Ledis Handbag',
        size: '25x25',
        color: 'Black',
        articleNo: '6748142',
        unit: '1',
        price: '$12'
    },
    {
        img: 'assets/images/product/15.png',
        name: 'Iphone 6',
        size: '15x15',
        color: 'gold',
        articleNo: '5748214',
        unit: '1',
        price: '$25'
    },
    {
        img: 'assets/images/product/14.png',
        name: 'Slippers',
        size: '6',
        color: 'Blue',
        articleNo: '8475112',
        unit: '1',
        price: '$6'
    },
];

