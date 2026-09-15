export interface TopLevel {
    name:           string;
    origin:         string;
    model:          string;
    description:    string;
    status:         string;
    image:          Image[];
    specifications: Specification[];
    quantity:       null;
    serialNumber:   string;
    sellingPrice:   number;
    priority:       null;
    brand:          string;
    timeWarranty:   number;
    category:       Category;
    createDate:     null;
}

export interface Category {
    id:   string;
    name: string;
    type: string;
}

export interface Image {
    imageURL:   string;
    createDate: Date;
}

export interface Specification {
    specificationId: string;
    machineryId:     string;
    name:            string;
    value:           string;
}
