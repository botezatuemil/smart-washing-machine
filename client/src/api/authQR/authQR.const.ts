import React from "react";

export type QRRequestType = {
    token: string;
    reservationId: React.Key;
    expoPushToken: string | undefined;
    user_id: React.Key;
}