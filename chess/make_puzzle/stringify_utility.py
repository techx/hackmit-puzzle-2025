import re

s = """1. e8=N Kb8 2. Ng7 Ka8 3. Nh5 Kb8 4. Nf6 Ka8 5. Ne4 Kb8 6. Ng3 Ka8 7. Nh1 Kb8 8. Nf2 Ka8 9. Nd1 Kb8 10. Nb2 Ka8 11. Na4 Kb8 12. Nc3 Ka8 13. Nd5 Kb8 14. Nb6 Ka7 15. Na8 Kb8 16. Nc7 Kc8 17. Nb5 Kb8 18. Na7 Ka8 19. Nc8 Kb8 20. d7 Ka8 21. Nd6 Kb8 22. Nc4 Ka8 23. Na5 Kb8 24. Nb3 Ka8 25. Na1 Kb8 26. Nc2 Ka8 27. Nd4 Kb8 28. Nf3 Ka8 29. Ne1 Kb8 30. Ng2 Ka8 31. Nh4 Kb8 32. Nf5 Ka8 33. Nh6 Kb8 34. Ng8 Ka8 35. Ne7 Kb8 36. Nc6+ Ka8 37. Nd8 Kb8 38. Nb7 Ka8 39. Na5 Kb8 40. Nb3 Ka8 41. Na1 Kb8 42. Nc2 Ka8 43. Nd4 Kb8 44. Nf3 Ka8 45. Ne1 Kb8 46. Ng2 Ka8 47. Nh4 Kb8 48. Ng6 Ka8 49. Nh8 Kb8 50. Nf7 Ka8 51. Ng5 Kb8 52. Nh7 Ka8 53. Nf8 Kb8 54. Ne6 Ka8 55. Nf4 Kb8 56. Nh3 Ka8 57. Ng1 Kb8 58. Ne2 Ka8 59. Nc1 Kb8 60. Na2 Ka8 61. Nb4 Kb8 62. Nd3 Ka8 63. Nc5 Kb8 64. Na6+ Ka8 65. Nb8 Ka7 66. d8=Q Ka8 67. Nd7+ Ka7 68. Ke6 Kb7 69. Ne5 Ka7 70. Nd7 Kb7 71. Qb8+ Ka6 72. Qb6#"""

# Add 186 to every leading number N.
new_s = re.sub(r'\b(\d+)\.', lambda m: f"{int(m.group(1)) + 186}.", s)

print(new_s)
