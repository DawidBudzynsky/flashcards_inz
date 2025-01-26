import React, { useState, useEffect } from "react";
import { TranslateRequest, translate } from "../requests/flashcard";

interface FlashcardInputs {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardInputProps {
  index: number;
  flashcard: FlashcardInputs;
  handleInputChange: (
    index: number,
    type: "question" | "answer",
    value: string,
  ) => void;
  handleDelete: (index: number) => void;
  fromLanguage: string;
  toLanguage: string;
}

const FlashcardInput: React.FC<FlashcardInputProps> = ({
  index,
  flashcard,
  handleInputChange,
  handleDelete,
  fromLanguage,
  toLanguage,
}) => {
  const [typingTimeout, setTypingTimeout] = useState<number | undefined>(
    undefined,
  );
  const [translationHint, setTranslationHint] = useState<string>("");

  const fetchTranslation = async (text: string) => {
    if (!text.trim()) {
      setTranslationHint("");
      return;
    }

    try {
      const request: TranslateRequest = {
        q: text,
        source: fromLanguage,
        target: toLanguage,
        format: "text",
      };

      const translatedText = await translate(request);
      setTranslationHint(translatedText);
    } catch (error) {
      console.error("Failed to fetch translation", error);
      setTranslationHint("Translation failed");
    }
  };

  const handleDebouncedChange = (value: string) => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchTranslation(value);
    }, 500);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    handleDebouncedChange(flashcard.question);
  }, [flashcard.question]);

  const applyTranslationHint = () => {
    handleInputChange(index, "answer", translationHint);
  };

  return (
    <div className="modal-box max-w-7xl w-full rounded-3xl space-y-5">
      <div className="flex justify-between">
        <div className="text-lg font-bold">Card number: {index + 1}</div>
        <button
          className="btn btn-sm btn-circle hover:bg-red-500"
          onClick={() => handleDelete(index)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-between md:space-x-24 pb-5">
        <div className="form-control w-full">
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Question"
            value={flashcard.question}
            onChange={(e) =>
              handleInputChange(index, "question", e.target.value)
            }
            required
          />
        </div>
        <div className="form-control w-full relative">
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Answer"
            value={flashcard.answer}
            onChange={(e) => handleInputChange(index, "answer", e.target.value)}
          />
          {translationHint && (
            <p
              className="text-sm text-gray-500 cursor-pointer mt-2 hover:underline"
              onClick={applyTranslationHint}
            >
              Suggested translation: {translationHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardInput;
