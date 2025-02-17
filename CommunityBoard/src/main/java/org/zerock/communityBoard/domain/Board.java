package org.zerock.communityBoard.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Getter
@ToString
@Entity //DB용 객체
@NoArgsConstructor
@AllArgsConstructor
public class Board extends BaseEntity {
//  글번호 pk
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bno;
//	제목
	@Column(length=500,nullable = false)
	private String title;
//	내용
	@Column(length=2000,nullable = false)
	private String content;
//	작성자
	@Column(length=50,nullable = false)
	private String writer;
// 좋아요
	@Column(nullable= false)
	private int likeCount;
// 싫어요
	@Column(nullable= false)
	private int dislikeCount;
	
	public void change(String title,String content) {
		this.title=title;
		this.content=content;
		
	}
	
	public void increaseLike() {
		this.likeCount++;
	}
	
	public void increaseDisLike() {
		this.dislikeCount++;
	}

}
