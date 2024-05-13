import {
    MedusaContainer,
    NotificationService
} from '@medusajs/medusa';

export default async (
    container: MedusaContainer
): Promise<void> => {
    const notificationService = container.resolve<NotificationService>('notificationService');

    notificationService.subscribe(
        'order.placed',
        'email-sender'
    );
    notificationService.subscribe(
        'order.shipment_created',
        'email-sender'
    );
    notificationService.subscribe(
        'customer.password_reset', 'email-sender');
};
