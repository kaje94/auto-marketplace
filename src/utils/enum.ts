// export enum Errors {
//     Unauthorized = "Unauthorized",
// }

// todo: check following conditions
export enum ListingStatusTypes {
    UnderReview = "UnderReview", // can edit
    Posted = "Posted", // can edit
    Declined = "Declined", // can edit
    Expired = "Expired", // can only renew
    Sold = "Sold", // lisintg screen or detail screen
    // just show one button and let user select temporary or permanent
    TemporarilyUnlisted = "TemporarilyUnlisted", // just show one button and let user select temporary or permanent lisintg screen or detail screen
    PermanentlyRemoved = "PermanentlyRemoved", // lisintg screen or detail screen
}

export enum VehicleTypes {
    Car = "Car",
    Van = "Van",
    Suv = "Suv",
    Jeep = "Jeep",
    CrewCab = "CrewCab",
    DoubleCab = "DoubleCab",
    Bus = "Bus",
    Lorry = "Lorry",
    ThreeWheel = "ThreeWheel",
    Motorcycle = "Motorcycle",
    Other = "Other",
}

export enum VehicleConditionTypes {
    BrandNew = "BrandNew",
    Registered = "Registered",
    Reconditioned = "Reconditioned",
}

export enum TransmissionTypes {
    Automatic = "Automatic",
    Manual = "Manual",
    Tiptronic = "Tiptronic",
    Other = "Other",
}

export enum FuelTypes {
    Petrol = "Petrol",
    Diesel = "Diesel",
    Hybrid = "Hybrid",
    Electric = "Electric",
    Other = "Other",
}

export enum ListingReportReason {
    AlreadySold = "AlreadySold",
    Fraud = "Fraud",
    Duplicate = "Duplicate",
    Spam = "Spam",
    WrongCategory = "WrongCategory",
}
