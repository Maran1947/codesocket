const getTruncateDescription = (description: string, maxLength: number): string => {
    if (description.length <= maxLength) {
        return description;
    }

    const truncated = description.substring(0, maxLength - 3);
    return truncated + '...';
}

export { getTruncateDescription }