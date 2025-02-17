package org.zerock.communityBoard.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor

public class BoardDTO {
	//글 번호
	private Long bno;
	//글 제목
	private String title;
	//글 내용
	private String content;
	//글 작성자
	private String writer;
	//좋아요
	private int likeCount;
	//작성 날짜
	private LocalDateTime regDate;
	//수정 날짜
	private LocalDateTime modDate;
}
