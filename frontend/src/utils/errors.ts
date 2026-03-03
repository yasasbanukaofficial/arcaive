export type ErrorContext =
  | "login"
  | "register"
  | "onboarding"
  | "settings"
  | "jobs"
  | "billing"
  | "generic";

const STATUS_MESSAGES: Record<ErrorContext, Partial<Record<number, string>>> = {
  login: {
    400: "Your account has been suspended. Please contact support.",
    401: "Incorrect password. Please try again.",
    403: "Invalid email or password format.",
    404: "No account found with this email address.",
    429: "Too many login attempts. Please wait a moment before trying again.",
    500: "Our servers are having trouble. Please try again shortly.",
    503: "Service temporarily unavailable. Please try again later.",
  },
  register: {
    400: "Please check that all fields are filled in correctly.",
    409: "An account with this email already exists.",
    422: "The information you provided is invalid. Please review and try again.",
    429: "Too many requests. Please slow down and try again.",
    500: "We couldn't create your account right now. Please try again.",
    503: "Service temporarily unavailable. Please try again later.",
  },
  onboarding: {
    400: "Please provide valid GitHub and LinkedIn URLs.",
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to complete onboarding.",
    422: "The profile details you entered are invalid. Please check and try again.",
    500: "We couldn't save your profile right now. Please try again.",
    503: "Service temporarily unavailable. Please try again later.",
  },
  settings: {
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to access these settings.",
    404: "Your account profile could not be found.",
    422: "The changes you made are invalid. Please review and try again.",
    500: "Unable to load your settings. Please refresh the page.",
    503: "Settings service is temporarily unavailable.",
  },
  jobs: {
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to view jobs.",
    404: "No jobs found at this time.",
    500: "Unable to load jobs right now. Please refresh the page.",
    503: "Job service is temporarily unavailable. Please try again shortly.",
  },
  billing: {
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to access billing.",
    404: "No billing information found.",
    500: "Unable to load billing information. Please refresh the page.",
    503: "Billing service is temporarily unavailable.",
  },
  generic: {
    400: "The request was invalid. Please check your input.",
    401: "You are not authenticated. Please log in.",
    403: "You don't have permission to do that.",
    404: "The requested resource was not found.",
    409: "This action conflicts with existing data.",
    422: "The information provided is invalid.",
    429: "Too many requests. Please slow down and try again.",
    500: "Something went wrong on our end. Please try again.",
    503: "Service temporarily unavailable. Please try again later.",
  },
};

function resolveStatusMessage(
  status: number,
  context: ErrorContext,
): string | undefined {
  const contextMap = STATUS_MESSAGES[context];
  if (contextMap[status]) return contextMap[status];
  if (status >= 500) return contextMap[500];
  return undefined;
}

export function extractErrorMessage(
  err: unknown,
  fallback: string,
  context: ErrorContext = "generic",
): string {
  if (!err || typeof err !== "object") return fallback;

  const axiosErr = err as {
    response?: {
      status?: number;
      data?: { message?: string; error?: string };
    };
    message?: string;
  };

  const status = axiosErr.response?.status;

  if (status) {
    const mapped = resolveStatusMessage(status, context);
    if (mapped) return mapped;
  }

  const serverMsg =
    axiosErr.response?.data?.message || axiosErr.response?.data?.error;

  if (serverMsg && isHumanReadable(serverMsg)) {
    return serverMsg;
  }

  return fallback;
}

function isHumanReadable(msg: string): boolean {
  const technicalPatterns = [
    /request failed with status code/i,
    /network error/i,
    /internal server error/i,
    /bad gateway/i,
    /service unavailable/i,
    /gateway timeout/i,
    /\b[45]\d{2}\b/, 
    /^error$/i,
    /^unknown error$/i,
    /^null$/i,
  ];
  return !technicalPatterns.some((re) => re.test(msg));
}
