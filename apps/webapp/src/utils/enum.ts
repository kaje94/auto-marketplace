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
    EveryThreeHours = "EveryThreeHours",
    EverySixHours = "EverySixHours",
    OnceADay = "OnceADay",
    OnceAWeek = "OnceAWeek",
}

export enum NotificationTypes {
    ListingApproved = "ListingApproved",
    ListingRejected = "ListingRejected",
    ListingExpired = "ListingExpired",
    ListingSubscriptionAlert = "ListingSubscriptionAlert",
}
