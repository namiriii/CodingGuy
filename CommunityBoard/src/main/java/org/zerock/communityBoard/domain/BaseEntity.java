package org.zerock.communityBoard.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@MappedSuperclass
@EntityListeners(value= {AuditingEntityListener.class})
@Getter
public class BaseEntity {
//	작성날짜
	@Column(name="regdate" ,updatable = false)
	@CreatedDate
	private LocalDateTime regDate;
//	수정날짜 
	@Column(name="moddate")
	@LastModifiedDate
	private LocalDateTime modDate;
}
