package review

const (
	//  0: no review
	NoReview int = iota

	//  1: "Total blackout", complete failure to recall the information.
	IncorrectBlackout

	//  2: Incorrect response, but upon seeing the correct answer it felt familiar.
	IncorrectFamiliar

	//  3: Incorrect response, but upon seeing the correct answer it seemed easy to remember.
	IncorrectEasy

	//  4: Correct response, but required significant difficulty to recall.
	CorrectHard

	//  5: Correct response, after some hesitation.
	CorrectEffort

	//  6: Correct response with perfect recall.
	CorrectEasy
)

type ReviewItem struct {
	CardId  int
	Quality int
}

type Due struct {
	DeckId string
	Items  []DueItem
}

type DueItem struct {
	CardId int
}
