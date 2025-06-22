from PIL import Image, PngImagePlugin

# Path to the original image
input_path = "assets/original_board.png"

# PGN metadata to embed
pgn_text = """1. Nh3 e6 2. f3 Qf6 3. Rg1 h6 4. e4 Qh4+ 5. Ke2 f6 6. b4 b5 7. d3 g6 8. Qe1 Qxe4+ 9. Kf2 Ne7 10. Qc3 a5 11. f4 Qd4+ 12. Ke1 Qxb4 13. Nd2 Qc5 14. Nc4 Qe5+ 15. Be2 a4 16. Qxe5 h5 17. Qd6 Nf5 18. Kf2 Ng3 19. Qa3 Ra5 20. Rb1 Kd8 21. Qb2 Na6 22. Bg4 a3 23. Bd2 hxg4 24. d4 Nf5 25. Bxa5 bxc4 26. Be1 Rg8 27. Qb6 Ng7 28. Qb3 c3 29. Kf1 Ne8 30. Qb5 gxh3 31. Qa4 Rg7 32. Bxc3 g5 33. Qxa3 c5 34. Bd2 Nb8 35. Bc3 g4 36. Ke2 Bd6 37. Rxb8 Rg8 38. d5 hxg2 39. Rbb1 f5 40. Qa6 Rg5 41. Rb2 Kc7 42. Kd1 c4 43. Rf1 Be5 44. Bb4 Rg8 45. Rf3 g1=N 46. Rf2 Bxa6 47. fxe5 Bc8 48. Bc5 Nf3 49. c3 Ng1 50. Rf3 gxf3 51. Kc1 Nf6 52. Rb7+ Bxb7 53. a3 Nh7 54. h3 Rg4 55. Kc2 Rg5 56. h4 Rg6 57. Bb6+ Kxb6 58. h5 Rg7 59. h6 Ka6 60. Kd2 Rg4 61. Kc2 Rg2+ 62. Kc1 Ng5 63. Kb1 Bc6 64. d6 Re2 65. Kc1 Rg2 66. h7 Ne2+ 67. Kb1 Rf2 68. Ka1 Kb5 69. h8=B Rg2 70. Bf6 Nf7 71. Bg7 Ka5 72. Bf8 Nh6 73. Kb2 Rg7 74. Kc2 Be4+ 75. Kb2 Ng8 76. Be7 Ka4 77. Bf6 Rh7 78. Ka2 Ng1 79. Bd8 Re7 80. Ba5 Nf6 81. Bc7 Rh7 82. Bb8 Rh8 83. Ba7 Re8 84. Ka1 Re7 85. Ka2 Nd5 86. Bf2 Ka5 87. Bd4 Re8 88. Kb2 Rc8 89. a4 Rf8 90. Kc1 Nc7 91. Kd1 Rf6 92. Bxg1 Bc6 93. Kc1 Rg6 94. Bc5 Kxa4 95. Ba3 Kxa3 96. Kb1 Rg4 97. Kc1 f2 98. Kd2 Rd4+ 99. Ke3 Rg4 100. Kxf2 Re4 101. Kf1 Ba4 102. Kg2 Kb2 103. Kg3 Nd5 104. Kh3 Re1 105. Kg3 Bd1 106. Kh2 Nf4 107. Kg3 Kb3 108. Kxf4 Bf3 109. Kg3 Bc6 110. Kh2 Kc2 111. Kh3 Rd1 112. Kh2 Bg2 113. Kg3 Rc1 114. Kh2 Bh1 115. Kg3 Bf3 116. Kh3 Rh1+ 117. Kg3 Bg4 118. Kf2 Kb1 119. Ke3 Rd1 120. Kf2 Re1 121. Kxe1 Bh3 122. Kf2 f4 123. Kg1 Bg4 124. Kf2 Kb2 125. Kg1 Ka1 126. Kg2 Kb2 127. Kf1 Kb1 128. Kf2 Kc2 129. Kg1 Kc1 130. Kh2 Bh5 131. Kg1 f3 132. Kf2 Kd1 133. Kg1 Ke1 134. Kh2 Bg6 135. Kh3 Bf7 136. Kg4 Bg8 137. Kxf3 Kf1 138. Ke3 Bh7 139. Kd2 Bc2 140. Ke3 Bd3 141. Kf3 Bf5 142. Ke3 Be4 143. Kd2 Bc6 144. Kc2 Kg2 145. Kb2 Kg3 146. Kc1 Kf3 147. Kd1 Kf4 148. Kc2 Kf3 149. Kb2 Ba8 150. Ka1 Kg2 151. Ka2 Kg3 152. Kb1 Kh3 153. Ka2 Kg3 154. Kb1 Kh2 155. Ka2 Kg3 156. Kb2 Kf4 157. Ka3 Bg2 158. Kb2 Ba8 159. Kc1 Kf3 160. Kd2 Ke4 161. Kc1 Kd5 162. Kd2 Bc6 163. Kc1 Bb7 164. Kb2 Bc8 165. Kc1 Kc6 166. Kd1 Ba6 167. Ke2 Bb7 168. Ke3 Ba6 169. Kd4 Bc8 170. Kxc4 Kb7 171. Kb3 Kb6 172. c4 Kc5 173. Ka4 Kd4 174. Ka5 Kxc4 175. Kb6 Ba6 176. Kxa6 Kb4 177. Kb7 Kb5 178. Kc7 Ka6 179. Kxd7 Ka7 180. Kxe6 Ka8 181. Kd5 Kb8 182. e6 Ka8 183. e7 Kb8 184. Ke5 Ka8"""

# Load the image
img = Image.open(input_path)
pixels = img.load()
width, height = img.size

# Colors defined
color_light = tuple(int("fffcdc"[i:i+2], 16) for i in (0, 2, 4))
color_dark = tuple(int("88a464"[i:i+2], 16) for i in (0, 2, 4))

# Manhattan distance threshold
threshold = 6

# Apply staircase (diamond) coloring based on Manhattan distance from each corner (get rid of rounded corners)
for x in range(width):
    for y in range(height):
        # Distance to top-left
        dist_tl = x + y
        # Distance to top-right
        dist_tr = (width - 1 - x) + y
        # Distance to bottom-left
        dist_bl = x + (height - 1 - y)
        # Distance to bottom-right
        dist_br = (width - 1 - x) + (height - 1 - y)

        if dist_tl <= threshold:
            pixels[x, y] = color_light
        elif dist_tr <= threshold:
            pixels[x, y] = color_dark
        elif dist_bl <= threshold:
            pixels[x, y] = color_dark
        elif dist_br <= threshold:
            pixels[x, y] = color_light

# Create PNG info object and add the PGN metadata
png_info = PngImagePlugin.PngInfo()
png_info.add_text("PGN", pgn_text)

# Output path for the modified image
output_path = "assets/puzzle_board.png"

# Save the image with embedded metadata
img.save(output_path, pnginfo=png_info)

output_path
