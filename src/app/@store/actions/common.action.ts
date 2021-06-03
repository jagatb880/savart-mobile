export class GetCountryCode {
  static readonly type = "[Common] GetCountryCode";
  constructor(public payload: { lookupname: string }) {}
}

export class WSValidateMobileNumber {
  static readonly type = "[Common] WSValidateMobileNumber";
  constructor(public payload: { custregmobile: string; custcountrycode: string }) {}
}

export class SendOTP {
  static readonly type = "[Common] SendOTP";
  constructor(public payload: { custregmobile: string; custcountrycode: string }) {}
}

export class ActiveButton {
  static readonly type = "[Common] ActiveButton";
  constructor(public activeButton: number) {}
}

export class Reset {
  static readonly type = "[Common] Reset";
}

export class SetMobileNumber {
  static readonly type = "[Common] SetMobileNumber";
  constructor(public mobileNumber: number) {}
}

export class SetCommonState {
  static readonly type = "[Common] SetCommonState";
  constructor(public payload: any) {}
}

export class UpdateCusStatus {
  static readonly type = "[Common] UpdateCusStatus";
}
export class SetNotificationCount {
  static readonly type = "[Common] SetNotificationCount";
  constructor(public notificationCount: any) {}
}

export class SetPlanExpired {
  static readonly type = "[Common] SetPlanExpired";
}
