import { toast } from "react-toastify";

export interface NotificationStrategy {
	notifySuccess(message: string): void;
	notifyError(message: string): void;
	notifyWarning(message: string): void;
}

export class ToastNotifications implements NotificationStrategy {
	notifySuccess(message: string): void {
		toast.success(message, {
			position: "top-center",
		});
	}
	notifyError(message: string): void {
		toast.error(message, {
			position: "top-center",
		});
	}

	notifyWarning(message: string): void {
		toast.warning(message, {
			position: "top-center",
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

const toastNotifications = new ToastNotifications();
export const notificationContext = new NotificationContext(toastNotifications);
