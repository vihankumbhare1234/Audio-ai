import os
import tkinter as tk
from tkinter import filedialog, messagebox
from gtts import gTTS


def save_speech():
    text = text_input.get("1.0", tk.END).strip()
    if not text:
        messagebox.showwarning("Input required", "Please enter the text you want to convert to speech.")
        return

    default_filename = "output.mp3"
    save_path = filedialog.asksaveasfilename(
        defaultextension=".mp3",
        filetypes=[("MP3 files", "*.mp3")],
        initialfile=default_filename,
        title="Save speech as MP3"
    )

    if not save_path:
        return

    try:
        tts = gTTS(text=text, lang="en", slow=False)
        tts.save(save_path)
        messagebox.showinfo("Success", f"Audio saved as {os.path.basename(save_path)}")
    except Exception as err:
        messagebox.showerror("Error", f"Failed to generate speech:\n{err}")


root = tk.Tk()
root.title("Text to Speech Converter")
root.geometry("500x360")
root.resizable(False, False)

frame = tk.Frame(root, padx=16, pady=16)
frame.pack(fill=tk.BOTH, expand=True)

label = tk.Label(frame, text="Enter text to convert to speech:", font=("Segoe UI", 11))
label.pack(anchor="w")

text_input = tk.Text(frame, wrap=tk.WORD, height=12, font=("Segoe UI", 10))
text_input.pack(fill=tk.BOTH, expand=True, pady=(8, 12))

button = tk.Button(frame, text="Save as MP3", command=save_speech, font=("Segoe UI", 10, "bold"), bg="#4CAF50", fg="white", padx=10, pady=6)
button.pack(side=tk.RIGHT)

note = tk.Label(frame, text="Requires internet access for Google TTS.", font=("Segoe UI", 9), fg="#555555")
note.pack(anchor="w", pady=(10, 0))

root.mainloop()