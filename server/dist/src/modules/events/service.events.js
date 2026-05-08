"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEvents = exports.ServiceEventPayload = void 0;
class ServiceEventPayload {
    id;
    name;
    status;
    latency;
    lastChecked;
}
exports.ServiceEventPayload = ServiceEventPayload;
var ServiceEvents;
(function (ServiceEvents) {
    ServiceEvents["CREATED"] = "service.created";
    ServiceEvents["UPDATED"] = "service.updated";
    ServiceEvents["DELETED"] = "service.deleted";
    ServiceEvents["STATUS_CHANGED"] = "service.statusChanged";
})(ServiceEvents || (exports.ServiceEvents = ServiceEvents = {}));
//# sourceMappingURL=service.events.js.map