package util

func SliceToSet(slice []string) []string {
	var set []string
	seen := make(map[string]bool)
	for _, item := range slice {
		if !seen[item] {
			set = append(set, item)
			seen[item] = true
		}
	}
	return set
}
