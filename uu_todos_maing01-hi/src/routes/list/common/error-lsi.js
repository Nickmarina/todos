// template: UU5Lsi Error
//@@viewOn:revision
// coded: Sofiia Franchuk (2734-2114-1), 02.08.2021
//@@viewOff:revision

const Lsi = {
  noData: {
    en: "No data"
  },
  contextError: {
    en: "Context Error"
  },
  defaultError: {
    en:
      "Sorry, we really do not known what could have gone wrong. If the problem persists please send an issue to helpdesk.",
  },
  badRequest: {
    en: "Sorry, something went wrong while processing your request.",
  },
  unauthorized: {
    cs:
      "Nemáte přístupová práva. Pokud si myslíte, že jde o chybu, kontaktujte prosím kompetentní osobu nebo pošlete požadavek na helpdesk.",
    en:
      "You are not authorized. If you think this is a mistake, please contact competent person or send issue to helpdesk.",
  },
  forbidden: {
    cs:
      "Nemáte přístupová práva. Pokud si myslíte, že jde o chybu, kontaktujte prosím kompetentní osobu nebo pošlete požadavek na helpdesk.",
    en:
      "You are not authorized. If you think this is a mistake, please contact competent person or send issue to helpdesk.",
  },
  notFound: {
    en: "Request is invalid. Please check provided Quadrilaterals Base Uri.",
  },
  internal: {
    en: "Internal error occured. Please try again and if the problem persists send an issue to helpdesk.",
  },
  serviceUnavailable: {
    en: "Service is currently unavailable. Please try again later.",
  },
  requestTimeout: {
    en: "Request timeout. Please try again later.",
  },
  baseNetworkError: {
    en: "Network error - resource is not available or does not exist.",
  },
  "uu-gateway-main/invalidRequest": {
    en: "Request is invalid. Please check provided baseUri.",
  },
  "uu-app-workspace/forbiddenAwidSysState": {
    cs:
      "Workspace aplikace není v aktivním stavu a pravděpodobně na něm probíhá údržba. Zkuste to prosím znovu později.",
    en: "Application workspace is not in active state and is probably under maintenance. Please try again later.",
  },
  "uu-app-workspace/forbiddenAsidSysState": {
    en: "Application instance is not in active state and is probably under maintenance. Please try again later.",
  },
};

//viewOn:exports
export default Lsi;
//viewOff:exports
