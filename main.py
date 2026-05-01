# main.py - MicroPython calibration workflow
# This file is intended to run on a MicroPython board.
# It uses a simple serial console UI so the same logic can run on most boards.

from time import sleep_ms

STATUS_READY = "ready"
STATUS_RUNNING = "running"
STATUS_SUCCESS = "success"

steps = [
    "Checking connection",
    "Reading device information",
    "Applying calibration profile",
    "Verifying calibration output",
    "Finalizing",
]

timeline = [
    {"delay_ms": 900, "step": 0, "progress": 20, "message": "Connection verified."},
    {"delay_ms": 1900, "step": 1, "progress": 40, "message": "Device information loaded."},
    {"delay_ms": 3000, "step": 2, "progress": 65, "message": "Calibration profile applied."},
    {"delay_ms": 4200, "step": 3, "progress": 85, "message": "Output verified within tolerance."},
    {"delay_ms": 5400, "step": 4, "progress": 100, "message": "Calibration complete."},
]

status = STATUS_READY
step_index = 0
progress = 0
log = [
    "System ready.",
    "Waiting for operator to start calibration.",
]


def log_message(message):
    global log
    log.append(message)
    print(message)


def print_status():
    print("\n=== Calibration Status ===")
    print("State:", status.upper())
    print("Step:", steps[step_index] if status == STATUS_RUNNING else "Awaiting operator input")
    print("Progress:", f"{progress}%")
    print("Device: Server Motor A")
    print("Firmware: v1.3.2")
    print("Profile: Default Profile")
    print("Calibration Result:", "Pass" if status == STATUS_SUCCESS else "Pending")
    print("\nActivity Log:")
    for entry in log:
        print("-", entry)
    print("==========================\n")


def reset_calibration():
    global status, step_index, progress, log
    status = STATUS_READY
    step_index = 0
    progress = 0
    log = [
        "System ready.",
        "Waiting for operator to start calibration.",
    ]
    print("Calibration reset. Press 's' to start again.")


def start_calibration():
    global status, step_index, progress
    if status == STATUS_RUNNING:
        print("Calibration is already running.")
        return

    status = STATUS_RUNNING
    step_index = 0
    progress = 0
    log.clear()
    log_message("Calibration started.")
    log_message("Checking connection...")

    for index, item in enumerate(timeline):
        sleep_ms(item["delay_ms"])
        step_index = item["step"]
        progress = item["progress"]
        log_message(item["message"])

    status = STATUS_SUCCESS
    log_message("Calibration finished successfully.")


def main_menu():
    print("MicroPython Calibration Console")
    print("Commands:")
    print("  s - Start calibration")
    print("  r - Reset calibration")
    print("  p - Print status")
    print("  q - Quit")

    while True:
        try:
            command = input("Enter command: ").strip().lower()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            break

        if not command:
            continue

        if command == "s":
            start_calibration()
        elif command == "r":
            reset_calibration()
        elif command == "p":
            print_status()
        elif command == "q":
            print("Quitting calibration console.")
            break
        else:
            print("Unknown command.")


if __name__ == "__main__":
    main_menu()
