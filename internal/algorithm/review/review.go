package review

// TODO: should change to 5
const (
	NoReview int = iota
	IncorrectBlackout
	IncorrectFamiliar
	IncorrectEasy
	CorrectHard
	CorrectEffort
	CorrectEasy
)

type ReviewItem struct {
	CardId  int
	Quality int
}
