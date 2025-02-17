package org.zerock.communityBoard.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReplyDTO {
	//리플번호
	private Long rno;
	//리플작성자
	private String replyer;
	//리플내용
	private String replyText;
	
	//작성일
	private LocalDateTime regDate;
	//수정일
	private LocalDateTime modDate;
	
	//해당 게시글 번호
	private Long bno;
}
