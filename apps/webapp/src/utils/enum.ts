export enum ListingStatusTypes {
    UnderReview = "UnderReview",
    Posted = "Posted",
    Declined = "Declined",
    Expired = "Expired",
    Sold = "Sold",
    TemporarilyUnlisted = "TemporarilyUnlisted",
    PermanentlyRemoved = "PermanentlyRemoved",
}

export enum VehicleTypes {
    Car = "Car",
    Van = "Van",
    SUV = "SUV",
    Jeep = "Jeep",
    Bus = "Bus",
    Truck = "Truck",
    ThreeWheeler = "ThreeWheeler",
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
}

export enum FuelTypes {
    Petrol = "Petrol",
    Diesel = "Diesel",
    Hybrid = "Hybrid",
    Electric = "Electric",
}

export enum ListingReportReason {
    AlreadySold = "AlreadySold",
    Fraud = "Fraud",
    Duplicate = "Duplicate",
    Spam = "Spam",
    WrongCategory = "WrongCategory",
}

export enum SubscriptionFrequencies {
    Daily = "Daily",
    Weekly = "Weekly",
    OnceEveryTwoWeeks = "OnceEveryTwoWeeks",
    Monthly = "Monthly",
}

export enum NotificationTypes {
    ListingApproved = "ListingApproved",
    ListingRejected = "ListingRejected",
    ListingExpired = "ListingExpired",
    ListingSubscriptionAlert = "ListingSubscriptionAlert",
}
