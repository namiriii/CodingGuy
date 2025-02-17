package org.zerock.communityBoard.DTO;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class PageResponseDTO<E> {
	private int page;
	private int size;
	private int total;
	
	//시작페이지번호
	private int start;
	//끝페이지번호
	private int end;
	
	//이번페이지 존재여부
	private boolean prev;
	//다음페이지 존재여부
	private boolean next;
	
	private List<E> dtoList;
	
	@Builder(builderMethodName = "withAll")
	public PageResponseDTO(PageRequestDTO pageRequestDTO, List<E> dtoList, int total) {
		if(total <=0) {
			return;
		}
		this.page=pageRequestDTO.getPage();
		this.size=pageRequestDTO.getSize();
		
		this.total = total;
		this.dtoList = dtoList;
		
		this.end = (int)(Math.ceil(this.page/10.0 ))	* 10; // 화면에서 마지막번호
		this.start = this.end -9;
		
		int last = (int)(Math.ceil((total/(double)size))); //데이터의 개수를 계산한 마지막페이지번호 ceil(올림)
		
		this.end = end > last ? last:end;
		this.prev = this.start > 1;
		this.next = total > this.end * this.size;
	}
}
