---
title: "1. Two Sum"
difficulty: Easy
leetcodeUrl: "https://leetcode.com/problems/two-sum/"
tags: ["Array", "Hash Table"]
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
---

## Problem

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.

## Intuition

For each number, we need its complement (`target - num`). Instead of scanning the array each time (O(n^2)), we store previously seen numbers in a hash map for O(1) lookup.

## Approach

1. Create an empty hash map
2. For each element, compute `complement = target - nums[i]`
3. If `complement` exists in the map, return `[map[complement], i]`
4. Otherwise, store `nums[i] → i` in the map

## Solution

```python
def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
```

## Complexity

- **Time**: O(n) — single pass through the array
- **Space**: O(n) — hash map stores up to n elements
