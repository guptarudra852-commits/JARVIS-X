export interface Permissions {
  browserAccess: boolean;
  desktopControl: boolean;
  emailSend: boolean;
  fileDelete: boolean;
  camera: boolean;
  microphone: boolean;
  terminal: boolean;
}

export class PermissionEngine {
  private permissions: Permissions = {
    browserAccess: true,
    desktopControl: false,
    emailSend: false,
    fileDelete: false,
    camera: false,
    microphone: false,
    terminal: false
  };

  getPermissions(): Permissions {
    return this.permissions;
  }

  setPermission(key: keyof Permissions, value: boolean): void {
    this.permissions[key] = value;
  }

  isAllowed(action: keyof Permissions): boolean {
    return this.permissions[action] || false;
  }
}
