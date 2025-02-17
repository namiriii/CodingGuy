package org.zerock.communityBoard.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString(exclude="board")
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Reply extends BaseEntity {
	//리플번호
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long rno;
	//리플내용
	private String replyText;
	//작성자
	private String replyer;
	
	//게시글 참조
	@ManyToOne(fetch = FetchType.LAZY)
	private Board board;
}
