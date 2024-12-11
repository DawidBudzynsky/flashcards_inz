import React from 'react';

interface Flashcard {
    question: string;
    answer: string;
}

interface FlashcardInputProps {
    index: number;
    flashcard: Flashcard;
    handleInputChange: (index: number, type: 'question' | 'answer', value: string) => void;
    handleDelete: (index: number) => void;

}

const FlashcardInput: React.FC<FlashcardInputProps> = ({ index, flashcard, handleInputChange, handleDelete }) => {

    return (
        < div className="flex flex-col mb-5 w-full space-x-10 bg-blue-800 px-6 py-2 rounded-lg mt-3" >

            <div className='flex justify-between'>
                <div className='text-white'>
                    Card number: {index + 1}

                </div>

                <button className="btn btn-circle btn-outline"
                    onClick={() => handleDelete(index)}>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className='flex space-x-10'>
                <div className="w-1/2">
                    <div className="form-control w-full">
                        <label htmlFor={`question_${index}`} className="label">
                            <span className="label-text text-white">Question</span>
                        </label>

                        <input
                            type="text"
                            name={`question_${index}`}
                            id={`question_${index}`}
                            className="input input-bordered w-full text-sm bg-transparent text-gray-900 border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
                            value={flashcard.question}
                            onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                            style={{ overflowWrap: 'break-word' }}
                            required
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <div className="form-control w-full">
                        <label htmlFor={`answer_${index}`} className="label">
                            <span className="label-text text-white">Answer</span>
                        </label>
                        <input
                            type="text"
                            name={`answer_${index}`}
                            id={`answer_${index}`}
                            className="input input-bordered w-full text-sm bg-transparent text-gray-900 border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
                            value={flashcard.answer}
                            onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                            style={{ overflowWrap: 'break-word' }}
                            required
                        />
                    </div>
                </div>
            </div >
        </div >


    )
        ;

}

export default FlashcardInput;
