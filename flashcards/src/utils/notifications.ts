import { toast } from "react-toastify";

const POSITION = "bottom-left";
export interface NotificationStrategy {
	notifySuccess(message: string): void;
	notifyError(message: string): void;
	notifyWarning(message: string): void;
}

export class AlertNotifications implements NotificationStrategy {
	notifySuccess(message: string): void {
		alert(message);
	}
	notifyError(message: string): void {
		alert(message);
	}
	notifyWarning(message: string): void {
		alert(message);
	}
}

export class ToastNotifications implements NotificationStrategy {
	notifySuccess(message: string): void {
		toast.success(message, {
			position: POSITION,
		});
	}
	notifyError(message: string): void {
		toast.error(message, {
			position: POSITION,
		});
	}
	notifyWarning(message: string): void {
		toast.warning(message, {
			position: POSITION,
		});
	}
}

export class NotificationContext {
	private strategy: NotificationStrategy;

	constructor(strategy: NotificationStrategy) {
		this.strategy = strategy;
	}

	setStrategy(strategy: NotificationStrategy) {
		this.strategy = strategy;
	}

	notifySuccess(message: string) {
		this.strategy.notifySuccess(message);
	}

	notifyError(message: string) {
		this.strategy.notifyError(message);
	}

	notifyWarning(message: string) {
		this.strategy.notifyWarning(message);
	}
}

const alertNotifications = new AlertNotifications();
const toastNotifications = new ToastNotifications();
export const notificationContext = new NotificationContext(alertNotifications);
